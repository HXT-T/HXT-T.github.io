$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$validator = Join-Path $root 'tools\Test-BlogPost.ps1'
$valid = Join-Path $root 'tools\tests\fixtures\valid-post.md'
$invalid = Join-Path $root 'tools\tests\fixtures\invalid-post.md'
$tempRoot = Join-Path $PSScriptRoot ('.validator-tests-' + [guid]::NewGuid().ToString('N'))
$postsRoot = Join-Path $tempRoot '_posts'
$utf8 = New-Object System.Text.UTF8Encoding($false)
$script:caseCount = 0

function New-PostText {
  param(
    [string]$Date = '2026-07-13 12:00:00 +0800',
    [string]$Room = 'garden',
    [string]$Status = 'seed',
    [AllowEmptyString()]
    [string]$Description = '"Valid description."',
    [string]$Body = 'Standard Markdown body.',
    [string]$OmitField
  )

  $fields = [ordered]@{
    title = '"A real test"'
    date = $Date
    room = $Room
    status = $Status
    topics = '[test]'
    categories = '[garden]'
    tags = '[jekyll]'
    description = $Description
    published = 'true'
  }

  $lines = [System.Collections.Generic.List[string]]::new()
  $lines.Add('---')
  foreach ($field in $fields.Keys) {
    if ($field -ne $OmitField) {
      $lines.Add(('{0}: {1}' -f $field, $fields[$field]))
    }
  }
  $lines.Add('---')
  $lines.Add('')
  $lines.Add($Body)
  return ($lines -join "`n") + "`n"
}

function Invoke-ValidatorFileCase {
  param(
    [string]$Name,
    [string]$Path,
    [int]$ExpectedExitCode,
    [string]$ExpectedMessage,
    [string]$UnexpectedMessage
  )

  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    $escapedValidator = $validator.Replace("'", "''")
    $escapedPath = $Path.Replace("'", "''")
    $childCommand = "`$Host.UI.RawUI.BufferSize = [System.Management.Automation.Host.Size]::new(4096, 300); & '$escapedValidator' -Path '$escapedPath'; exit `$LASTEXITCODE"
    $encodedCommand = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($childCommand))
    $output = (& powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand $encodedCommand 2>&1 | Out-String)
    $exitCode = $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }
  if ($exitCode -ne $ExpectedExitCode) {
    throw "${Name}: expected exit code $ExpectedExitCode, got $exitCode.`n$output"
  }
  if (-not $output.Contains($ExpectedMessage)) {
    throw "${Name}: expected output to contain '$ExpectedMessage'.`n$output"
  }
  if ($UnexpectedMessage -and $output.Contains($UnexpectedMessage)) {
    throw "${Name}: expected output not to contain '$UnexpectedMessage'.`n$output"
  }
  $script:caseCount++
}

function Invoke-ValidatorTextCase {
  param(
    [string]$Name,
    [string]$Markdown,
    [int]$ExpectedExitCode,
    [string]$ExpectedMessage,
    [string]$UnexpectedMessage,
    [string]$FileName = 'case.md',
    [switch]$InPosts
  )

  $directory = if ($InPosts) { $postsRoot } else { $tempRoot }
  $path = Join-Path $directory $FileName
  [System.IO.File]::WriteAllText($path, $Markdown, $utf8)
  Invoke-ValidatorFileCase -Name $Name -Path $path -ExpectedExitCode $ExpectedExitCode -ExpectedMessage $ExpectedMessage -UnexpectedMessage $UnexpectedMessage
}

$dateError = 'date must match YYYY-MM-DD HH:mm:ss +0800.'
$roomError = 'room must be study, garden, workbench, or collection.'
$statusError = 'status must be seed, sprout, growing, evergreen, or dormant.'
$descriptionError = 'description must not be empty when publishing.'
$wikiError = 'Obsidian Wiki links and embeds are not publishable; use standard Markdown links.'
$fileNameError = 'Published filename must match YYYY-MM-DD-lowercase-slug.md.'

try {
  [void](New-Item -ItemType Directory -Path $postsRoot -Force)

  $resolvedValid = (Resolve-Path -LiteralPath $valid).Path
  Invoke-ValidatorFileCase -Name 'valid fixture' -Path $valid -ExpectedExitCode 0 -ExpectedMessage "Post validation passed: $resolvedValid"
  Invoke-ValidatorFileCase -Name 'multi-error fixture' -Path $invalid -ExpectedExitCode 1 -ExpectedMessage $wikiError

  foreach ($field in 'title', 'date', 'room', 'status', 'topics', 'categories', 'tags', 'description', 'published') {
    $unexpectedMessage = switch ($field) {
      'date' { $dateError }
      'room' { $roomError }
      'status' { $statusError }
      'description' { $descriptionError }
      default { $null }
    }
    Invoke-ValidatorTextCase -Name "missing $field" -Markdown (New-PostText -OmitField $field) -ExpectedExitCode 1 -ExpectedMessage "Missing Front Matter field: $field" -UnexpectedMessage $unexpectedMessage
  }

  foreach ($date in "'2026-07-13 12:00:00 +0800'", '"2026-07-13 12:00:00 +0800"') {
    Invoke-ValidatorTextCase -Name "valid quoted date $date" -Markdown (New-PostText -Date $date) -ExpectedExitCode 0 -ExpectedMessage 'Post validation passed:'
  }
  Invoke-ValidatorTextCase -Name 'empty date' -Markdown (New-PostText -Date '') -ExpectedExitCode 1 -ExpectedMessage $dateError
  Invoke-ValidatorTextCase -Name 'malformed date' -Markdown (New-PostText -Date '2026-07-13') -ExpectedExitCode 1 -ExpectedMessage $dateError
  Invoke-ValidatorTextCase -Name 'date trailing token' -Markdown (New-PostText -Date '2026-07-13 12:00:00 +0800 extra') -ExpectedExitCode 1 -ExpectedMessage $dateError

  foreach ($room in "'garden'", '"garden"') {
    Invoke-ValidatorTextCase -Name "valid quoted room $room" -Markdown (New-PostText -Room $room) -ExpectedExitCode 0 -ExpectedMessage 'Post validation passed:'
  }
  Invoke-ValidatorTextCase -Name 'empty room' -Markdown (New-PostText -Room '') -ExpectedExitCode 1 -ExpectedMessage $roomError
  Invoke-ValidatorTextCase -Name 'unknown room' -Markdown (New-PostText -Room 'unknown') -ExpectedExitCode 1 -ExpectedMessage $roomError
  Invoke-ValidatorTextCase -Name 'room trailing token' -Markdown (New-PostText -Room 'garden extra') -ExpectedExitCode 1 -ExpectedMessage $roomError

  foreach ($status in "'seed'", '"seed"') {
    Invoke-ValidatorTextCase -Name "valid quoted status $status" -Markdown (New-PostText -Status $status) -ExpectedExitCode 0 -ExpectedMessage 'Post validation passed:'
  }
  Invoke-ValidatorTextCase -Name 'empty status' -Markdown (New-PostText -Status '') -ExpectedExitCode 1 -ExpectedMessage $statusError
  Invoke-ValidatorTextCase -Name 'unknown status' -Markdown (New-PostText -Status 'finished') -ExpectedExitCode 1 -ExpectedMessage $statusError
  Invoke-ValidatorTextCase -Name 'status trailing token' -Markdown (New-PostText -Status 'seed extra') -ExpectedExitCode 1 -ExpectedMessage $statusError

  foreach ($description in "'Valid description'", '"Valid description"') {
    Invoke-ValidatorTextCase -Name "valid quoted description $description" -Markdown (New-PostText -Description $description) -ExpectedExitCode 0 -ExpectedMessage 'Post validation passed:'
  }
  foreach ($description in "'null'", '"null"', "'~'", '"~"') {
    Invoke-ValidatorTextCase -Name "valid quoted sentinel description $description" -Markdown (New-PostText -Description $description) -ExpectedExitCode 0 -ExpectedMessage 'Post validation passed:'
  }
  foreach ($description in '', "''", '""', 'null', '~') {
    Invoke-ValidatorTextCase -Name "invalid empty description '$description'" -Markdown (New-PostText -Description $description) -ExpectedExitCode 1 -ExpectedMessage $descriptionError
  }

  Invoke-ValidatorTextCase -Name 'Wiki link' -Markdown (New-PostText -Body 'Contains [[Wiki Link]].') -ExpectedExitCode 1 -ExpectedMessage $wikiError
  Invoke-ValidatorTextCase -Name 'Wiki embed' -Markdown (New-PostText -Body 'Contains ![[image.png]].') -ExpectedExitCode 1 -ExpectedMessage $wikiError

  Invoke-ValidatorTextCase -Name 'valid published filename' -Markdown (New-PostText) -ExpectedExitCode 0 -ExpectedMessage 'Post validation passed:' -FileName '2026-07-13-valid-slug.md' -InPosts
  Invoke-ValidatorTextCase -Name 'invalid published filename' -Markdown (New-PostText) -ExpectedExitCode 1 -ExpectedMessage $fileNameError -FileName 'Invalid Name.md' -InPosts

  "Validator tests passed: $caseCount cases"
} finally {
  $resolvedTestsRoot = (Resolve-Path -LiteralPath $PSScriptRoot).Path
  $resolvedTempRoot = if (Test-Path -LiteralPath $tempRoot) { (Resolve-Path -LiteralPath $tempRoot).Path } else { $null }
  if ($resolvedTempRoot -and $resolvedTempRoot.StartsWith($resolvedTestsRoot + [System.IO.Path]::DirectorySeparatorChar)) {
    Remove-Item -LiteralPath $resolvedTempRoot -Recurse -Force
  }
}

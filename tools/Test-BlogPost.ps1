param(
  [Parameter(Mandatory = $true)]
  [string]$Path
)

function Get-FrontMatterScalar {
  param(
    [string]$Yaml,
    [string]$Field
  )

  $pattern = '(?m)^' + [regex]::Escape($Field) + '[ \t]*:[ \t]*(.*)$'
  $match = [regex]::Match($Yaml, $pattern)
  if (-not $match.Success) {
    return $null
  }

  $value = $match.Groups[1].Value.Trim()
  $isQuoted = $false
  if ($value.Length -ge 2) {
    $first = $value[0]
    $last = $value[$value.Length - 1]
    if (($first -eq '"' -and $last -eq '"') -or ($first -eq "'" -and $last -eq "'")) {
      $isQuoted = $true
      $value = $value.Substring(1, $value.Length - 2)
    }
  }
  return [pscustomobject]@{
    Value = $value
    IsQuoted = $isQuoted
  }
}

$errors = [System.Collections.Generic.List[string]]::new()

if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
  Write-Error "Post does not exist: $Path"
  exit 1
}

$resolved = (Resolve-Path -LiteralPath $Path).Path
$text = Get-Content -LiteralPath $resolved -Raw -Encoding UTF8
$name = [System.IO.Path]::GetFileName($resolved)
$parent = Split-Path (Split-Path $resolved -Parent) -Leaf

if ($parent -eq '_posts' -and $name -notmatch '^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9-]*\.md$') {
  $errors.Add('Published filename must match YYYY-MM-DD-lowercase-slug.md.')
}

$frontMatter = [regex]::Match($text, '(?s)\A---\s*\r?\n(.*?)\r?\n---\s*\r?\n')
if (-not $frontMatter.Success) {
  $errors.Add('File must start with YAML Front Matter delimited by --- lines.')
} else {
  $yaml = $frontMatter.Groups[1].Value
  $fieldPresent = @{}
  foreach ($field in 'title', 'date', 'room', 'status', 'topics', 'categories', 'tags', 'description', 'published') {
    $fieldPresent[$field] = [regex]::IsMatch($yaml, "(?m)^$([regex]::Escape($field))[ \t]*:")
    if (-not $fieldPresent[$field]) {
      $errors.Add("Missing Front Matter field: $field")
    }
  }

  if ($fieldPresent['date']) {
    $date = Get-FrontMatterScalar -Yaml $yaml -Field 'date'
    if ($date.Value -notmatch '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+0800$') {
      $errors.Add('date must match YYYY-MM-DD HH:mm:ss +0800.')
    }
  }
  if ($fieldPresent['room']) {
    $room = Get-FrontMatterScalar -Yaml $yaml -Field 'room'
    if ($room.Value -notin 'study', 'garden', 'workbench', 'collection') {
      $errors.Add('room must be study, garden, workbench, or collection.')
    }
  }
  if ($fieldPresent['status']) {
    $status = Get-FrontMatterScalar -Yaml $yaml -Field 'status'
    if ($status.Value -notin 'seed', 'sprout', 'growing', 'evergreen', 'dormant') {
      $errors.Add('status must be seed, sprout, growing, evergreen, or dormant.')
    }
  }
  if ($fieldPresent['description']) {
    $description = Get-FrontMatterScalar -Yaml $yaml -Field 'description'
    $published = Get-FrontMatterScalar -Yaml $yaml -Field 'published'
    $isPublished = $published -and $published.Value -eq 'true'
    if ($isPublished -and ([string]::IsNullOrWhiteSpace($description.Value) -or (-not $description.IsQuoted -and $description.Value -in 'null', '~'))) {
      $errors.Add('description must not be empty when publishing.')
    }
  }
}

if ($text -match '!?\[\[') {
  $errors.Add('Obsidian Wiki links and embeds are not publishable; use standard Markdown links.')
}

if ($errors.Count -gt 0) {
  $errors | ForEach-Object { Write-Error $_ }
  exit 1
}

Write-Output "Post validation passed: $resolved"
exit 0

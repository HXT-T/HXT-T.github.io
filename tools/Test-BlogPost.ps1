param(
  [Parameter(Mandatory = $true)]
  [string]$Path
)

$errors = [System.Collections.Generic.List[string]]::new()

if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
  Write-Error "Post does not exist: $Path"
  exit 1
}

$resolved = (Resolve-Path -LiteralPath $Path).Path
$text = Get-Content -LiteralPath $resolved -Raw
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
  foreach ($field in 'title', 'date', 'room', 'status', 'topics', 'categories', 'tags', 'description', 'published') {
    if ($yaml -notmatch "(?m)^$([regex]::Escape($field))\s*:") {
      $errors.Add("Missing Front Matter field: $field")
    }
  }

  if ($yaml -match '(?m)^date\s*:\s*(.+)$' -and $Matches[1].Trim() -notmatch '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \+0800$') {
    $errors.Add('date must match YYYY-MM-DD HH:mm:ss +0800.')
  }
  if ($yaml -match '(?m)^room\s*:\s*(\S+)' -and $Matches[1] -notin 'study', 'garden', 'workbench', 'collection') {
    $errors.Add('room must be study, garden, workbench, or collection.')
  }
  if ($yaml -match '(?m)^status\s*:\s*(\S+)' -and $Matches[1] -notin 'seed', 'sprout', 'growing', 'evergreen', 'dormant') {
    $errors.Add('status must be seed, sprout, growing, evergreen, or dormant.')
  }
  if ($yaml -match '(?m)^description\s*:\s*"?\s*"?\s*$') {
    $errors.Add('description must not be empty when publishing.')
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

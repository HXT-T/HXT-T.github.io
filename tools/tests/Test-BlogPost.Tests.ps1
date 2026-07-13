$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$validator = Join-Path $root 'tools\Test-BlogPost.ps1'
$valid = Join-Path $root 'tools\tests\fixtures\valid-post.md'
$invalid = Join-Path $root 'tools\tests\fixtures\invalid-post.md'

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $validator -Path $valid
if ($LASTEXITCODE -ne 0) { throw 'Expected valid fixture to pass.' }

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $validator -Path $invalid
if ($LASTEXITCODE -eq 0) { throw 'Expected invalid fixture to fail.' }

'Validator tests passed'

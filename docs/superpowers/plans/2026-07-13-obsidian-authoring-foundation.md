# Obsidian Authoring Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the local Jekyll repository into a safe Obsidian Vault with reusable article templates, a pre-publish validator, and a documented Git-to-GitHub Pages workflow.

**Architecture:** The repository root is the Vault root, so Obsidian edits the same Markdown files Jekyll builds. Versioned Obsidian settings contain only portable authoring preferences; personal workspace state stays ignored. A PowerShell validator catches Jekyll filename/front-matter errors and Obsidian-only link syntax before local build and push.

**Tech Stack:** Obsidian desktop, Markdown/YAML Front Matter, PowerShell 5.1+, Git, Jekyll 4.3, Chirpy 6.5, Ruby 3.2 in CI.

## Global Constraints

- Keep Jekyll 4.3, Chirpy 6.5, the existing `main` → GitHub Actions → `gh-pages` deployment, and the existing Giscus configuration.
- Do not introduce Vue, Node, a UI component library, or another publishing engine.
- Store drafts in `_drafts`, published posts in `_posts`, templates in `_templates`, and article media under `assets/img/posts`.
- Use standard Markdown links instead of Obsidian Wiki links in publishable content.
- Never commit Obsidian workspace state, caches, tokens, private notes, or generated Jekyll output.
- Preserve site appearance and navigation in this plan; room pages and visual design belong to later plans.

---

## File Structure

- `.obsidian/app.json`: portable link, attachment, and new-note preferences.
- `.obsidian/templates.json`: core Templates plugin folder selection.
- `.gitignore`: personal Obsidian state and cache exclusions.
- `_drafts/.gitkeep`: tracked draft directory without publishing private content.
- `_templates/blog-post.md`: reusable Templater-compatible article skeleton.
- `assets/img/posts/.gitkeep`: tracked media root.
- `tools/Test-BlogPost.ps1`: deterministic pre-publish validation command.
- `tools/tests/fixtures/valid-post.md`: valid validator fixture.
- `tools/tests/fixtures/invalid-post.md`: invalid validator fixture.
- `tools/tests/Test-BlogPost.Tests.ps1`: dependency-free validator regression test.
- `docs/authoring-with-obsidian.md`: human setup and daily publishing guide.
- `README.md`: short link to the authoring guide.

### Task 1: Safe Obsidian Vault Structure

**Files:**
- Create: `.obsidian/app.json`
- Create: `.obsidian/templates.json`
- Create: `_drafts/.gitkeep`
- Create: `assets/img/posts/.gitkeep`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: repository root `D:\Az\HXT-T.github.io` as the Vault root.
- Produces: `_drafts`, `_templates`, and `assets/img/posts` paths used by later tasks; portable Obsidian settings with standard Markdown links.

- [ ] **Step 1: Run the structure check and verify it fails**

Run:

```powershell
$required = '.obsidian/app.json', '.obsidian/templates.json', '_drafts/.gitkeep', 'assets/img/posts/.gitkeep'
$missing = $required | Where-Object { -not (Test-Path -LiteralPath $_) }
if ($missing) { $missing; exit 1 }
```

Expected: exit code `1` and all four paths printed.

- [ ] **Step 2: Create the portable Obsidian application settings**

Create `.obsidian/app.json`:

```json
{
  "attachmentFolderPath": "assets/img/posts",
  "newFileLocation": "folder",
  "newFileFolderPath": "_drafts",
  "newLinkFormat": "relative",
  "useMarkdownLinks": true
}
```

Create `.obsidian/templates.json`:

```json
{
  "folder": "_templates"
}
```

- [ ] **Step 3: Create tracked empty directories**

Create empty files:

```text
_drafts/.gitkeep
assets/img/posts/.gitkeep
```

- [ ] **Step 4: Ignore personal Obsidian state**

Append to `.gitignore`:

```gitignore

# Obsidian personal state and caches
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/cache/
.trash/
```

- [ ] **Step 5: Re-run the structure and privacy checks**

Run:

```powershell
$required = '.obsidian/app.json', '.obsidian/templates.json', '_drafts/.gitkeep', 'assets/img/posts/.gitkeep'
$missing = $required | Where-Object { -not (Test-Path -LiteralPath $_) }
if ($missing) { $missing; exit 1 }
$ignored = git check-ignore .obsidian/workspace.json .obsidian/workspace-mobile.json .obsidian/cache/test .trash/private.md
if (($ignored | Measure-Object).Count -ne 4) { $ignored; exit 1 }
'Vault structure OK'
```

Expected: `Vault structure OK` and exit code `0`.

- [ ] **Step 6: Commit the Vault structure**

```powershell
git add .obsidian/app.json .obsidian/templates.json .gitignore _drafts/.gitkeep assets/img/posts/.gitkeep
git commit -m "chore: prepare repository as an Obsidian vault"
```

### Task 2: Blog Article Template

**Files:**
- Create: `_templates/blog-post.md`

**Interfaces:**
- Consumes: `_templates` configured by `.obsidian/templates.json`.
- Produces: Front Matter fields `title`, `date`, `room`, `status`, `topics`, `categories`, `tags`, `description`, and `published`, which the validator in Task 3 reads.

- [ ] **Step 1: Verify that the required template fields are absent**

Run:

```powershell
if (-not (Test-Path '_templates/blog-post.md')) { exit 1 }
```

Expected: exit code `1`.

- [ ] **Step 2: Create the template**

Create `_templates/blog-post.md`:

```markdown
---
title: "<% tp.file.title %>"
date: <% tp.date.now("YYYY-MM-DD HH:mm:ss") %> +0800
room: garden
status: seed
topics: []
categories: [花园]
tags: []
description: ""
published: false
---

> 这项内容为什么值得被记录？它目前处于什么状态？

## 起点

## 现在的理解

## 仍然存在的问题

## 相关内容
```

The default `room: garden`, `status: seed`, and `published: false` make accidental publication unlikely. When publishing a book-room article, change `room` to `study`, `status` to `evergreen`, set a stable category, and set `published: true`.

- [ ] **Step 3: Check all required fields and headings**

Run:

```powershell
$text = Get-Content -Raw '_templates/blog-post.md'
$required = 'title:', 'date:', 'room:', 'status:', 'topics:', 'categories:', 'tags:', 'description:', 'published:', '## 起点', '## 现在的理解', '## 仍然存在的问题', '## 相关内容'
$missing = $required | Where-Object { $text -notmatch [regex]::Escape($_) }
if ($missing) { $missing; exit 1 }
'Template OK'
```

Expected: `Template OK` and exit code `0`.

- [ ] **Step 4: Commit the article template**

```powershell
git add _templates/blog-post.md
git commit -m "feat: add Obsidian blog article template"
```

### Task 3: Pre-Publish Validator

**Files:**
- Create: `tools/Test-BlogPost.ps1`
- Create: `tools/tests/fixtures/valid-post.md`
- Create: `tools/tests/fixtures/invalid-post.md`
- Create: `tools/tests/Test-BlogPost.Tests.ps1`

**Interfaces:**
- Consumes: one Markdown file path via `-Path <string>`.
- Produces: exit code `0` plus `Post validation passed: <path>` for valid posts; exit code `1` and one line per validation error for invalid posts.
- Valid values: `room` is one of `study`, `garden`, `workbench`, `collection`; `status` is one of `seed`, `sprout`, `growing`, `evergreen`, `dormant`.

- [ ] **Step 1: Create test fixtures**

Create `tools/tests/fixtures/valid-post.md`:

```markdown
---
title: "一次真实的测试"
date: 2026-07-13 12:00:00 +0800
room: garden
status: seed
topics: [测试]
categories: [花园]
tags: [jekyll]
description: "用于验证发布前检查脚本。"
published: true
---

这是一个使用[标准 Markdown 链接](/)的有效测试文件。
```

Create `tools/tests/fixtures/invalid-post.md`:

```markdown
---
title: "错误测试"
date: 2026-07-13
room: unknown
status: finished
topics: []
categories: []
tags: []
description: ""
published: true
---

这里包含 [[Obsidian Wiki Link]] 和 ![[image.png]]。
```

- [ ] **Step 2: Create the regression test before the validator**

Create `tools/tests/Test-BlogPost.Tests.ps1`:

```powershell
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
```

- [ ] **Step 3: Run the test and verify it fails**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/tests/Test-BlogPost.Tests.ps1
```

Expected: failure because `tools/Test-BlogPost.ps1` does not exist.

- [ ] **Step 4: Implement the validator**

Create `tools/Test-BlogPost.ps1`:

```powershell
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
```

- [ ] **Step 5: Run validator regression tests**

Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/tests/Test-BlogPost.Tests.ps1
```

Expected: invalid-fixture errors followed by `Validator tests passed`, with final exit code `0`.

- [ ] **Step 6: Validate all existing published posts**

Run:

```powershell
$legacy = [System.Collections.Generic.List[string]]::new()
Get-ChildItem '_posts\*.md' | ForEach-Object {
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/Test-BlogPost.ps1 -Path $_.FullName
  if ($LASTEXITCODE -ne 0) { $legacy.Add($_.Name) }
}
if ($legacy.Count -gt 0) {
  'Existing-post migration required in the content-model plan:'
  $legacy
} else {
  'All existing posts already use the new content model.'
}
exit 0
```

Expected: exit code `0`. Existing posts that predate the new `room`, `status`, and `topics` fields are listed under `Existing-post migration required in the content-model plan`. Do not rewrite existing content in this task.

- [ ] **Step 7: Commit the validator**

```powershell
git add tools/Test-BlogPost.ps1 tools/tests/Test-BlogPost.Tests.ps1 tools/tests/fixtures/valid-post.md tools/tests/fixtures/invalid-post.md
git commit -m "feat: validate posts before publication"
```

### Task 4: Obsidian Authoring Guide

**Files:**
- Create: `docs/authoring-with-obsidian.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: Vault paths and validator command from Tasks 1–3.
- Produces: the exact human workflow for opening the Vault, installing optional plugins, drafting, validating, previewing, committing, pushing, and checking deployment.

- [ ] **Step 1: Check that no authoring guide is linked**

Run:

```powershell
if (Test-Path 'docs/authoring-with-obsidian.md') { exit 1 }
if ((Get-Content -Raw README.md) -match 'authoring-with-obsidian') { exit 1 }
```

Expected: exit code `0`; the guide and README link are absent.

- [ ] **Step 2: Write the authoring guide**

Create `docs/authoring-with-obsidian.md` with these exact sections and commands:

```markdown
# 使用 Obsidian 写作并发布博客

## 打开 Vault

在 Obsidian 中选择“打开本地仓库”，目录为 `D:\Az\HXT-T.github.io`。

## 插件

先启用核心插件“模板”。按需安装 Templater、Linter 和 Obsidian Git。初期关闭自动提交和自动推送，只使用手动 Pull、Commit 和 Push。插件配置文件可能包含本地状态，提交前必须查看 Git 差异。

## 写作

1. 先执行 Git Pull。
2. 在 `_drafts` 新建 Markdown 文件。
3. 插入 `_templates/blog-post.md`。
4. 保持 `published: false`，记录内容并选择 `room`、`status` 和 `topics`。
5. 使用标准 Markdown 链接；图片放在 `assets/img/posts`。

## 发布

1. 将文件改名为 `YYYY-MM-DD-lowercase-slug.md` 并移入 `_posts`。
2. 填写非空 `description`，确认日期包含 `+0800`，设置 `published: true`。
3. 运行：

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/Test-BlogPost.ps1 -Path _posts/YYYY-MM-DD-lowercase-slug.md
   bundle exec jekyll build
   ```

4. 检查 `git status` 和 `git diff`，确认没有私人笔记、密钥、工作区状态或未脱敏截图。
5. 提交并推送：

   ```powershell
   git pull --ff-only
   git add _posts/YYYY-MM-DD-lowercase-slug.md assets/img/posts
   git commit -m "post: 发布文章标题"
   git push origin main
   ```

6. 在 GitHub Actions 检查 `Pages Deploy`，再检查线上页面。

## 失败处理

如果 Pull 出现冲突，停止推送，在 Git 中解决冲突并重新预览。如果校验或 Jekyll 构建失败，先修复第一条具体错误；不要通过空提交反复触发部署。
```

- [ ] **Step 3: Add the README link**

Under `## 快速开始` in `README.md`, insert:

```markdown
使用 Obsidian 写作与发布：[完整教程](docs/authoring-with-obsidian.md)
```

- [ ] **Step 4: Verify guide commands and paths**

Run:

```powershell
$guide = Get-Content -Raw 'docs/authoring-with-obsidian.md'
$required = 'D:\Az\HXT-T.github.io', '_drafts', '_templates/blog-post.md', 'assets/img/posts', 'tools/Test-BlogPost.ps1', 'bundle exec jekyll build', 'git pull --ff-only', 'git push origin main', 'Pages Deploy'
$missing = $required | Where-Object { $guide -notmatch [regex]::Escape($_) }
if ($missing) { $missing; exit 1 }
if ((Get-Content -Raw README.md) -notmatch 'docs/authoring-with-obsidian.md') { exit 1 }
'Authoring guide OK'
```

Expected: `Authoring guide OK` and exit code `0`.

- [ ] **Step 5: Commit the guide**

```powershell
git add docs/authoring-with-obsidian.md README.md
git commit -m "docs: document Obsidian publishing workflow"
```

### Task 5: Foundation Verification

**Files:**
- No new files.
- Verify all files created or modified in Tasks 1–4.

**Interfaces:**
- Consumes: Vault settings, template, validator, tests, and guide.
- Produces: an independently usable Obsidian authoring foundation ready for the later content-model plan.

- [ ] **Step 1: Run PowerShell validator tests**

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/tests/Test-BlogPost.Tests.ps1
```

Expected: `Validator tests passed` and final exit code `0`.

- [ ] **Step 2: Check repository formatting**

```powershell
git diff --check HEAD~4
```

Expected: no output and exit code `0`.

- [ ] **Step 3: Build the production site**

```powershell
$env:JEKYLL_ENV = 'production'
bundle exec jekyll build
$buildExit = $LASTEXITCODE
Remove-Item Env:JEKYLL_ENV
exit $buildExit
```

Expected: `done in ... seconds` and exit code `0`.

- [ ] **Step 4: Verify generated artifacts remain ignored**

```powershell
git status --short
git check-ignore _site .jekyll-cache
```

Expected: clean working tree; `_site` and `.jekyll-cache` are printed as ignored.

- [ ] **Step 5: Review commit sequence**

```powershell
git log -4 --oneline
```

Expected, newest first:

```text
<sha> docs: document Obsidian publishing workflow
<sha> feat: validate posts before publication
<sha> feat: add Obsidian blog article template
<sha> chore: prepare repository as an Obsidian vault
```

Do not push in this plan. Remote publication requires a separate explicit approval after local verification.

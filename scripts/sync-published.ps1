param(
  [string]$WikiPublished = "..\Academic_WIKI\06_Published",
  [string]$QuartzResearch = ".\content\research",
  [bool]$RequireUserApproval = $true
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

$sourceRoot = Resolve-Path $WikiPublished
$targetRoot = Resolve-Path $QuartzResearch
$writerNotify = Resolve-Path (Join-Path $projectRoot "..\Academic_WIKI\.claude\scripts\writer-notify.ps1") -ErrorAction SilentlyContinue

$files = Get-ChildItem -LiteralPath $sourceRoot -Filter "*.md" -File
$synced = 0
$skippedApproval = 0

foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8

  if ($text -notmatch "status:\s*published") { continue }
  if ($text -notmatch "quartz_status:\s*ready_for_quartz") { continue }

  if ($RequireUserApproval -and $text -notmatch "(?m)^quartz_user_approved:\s*true\s*$") {
    $skippedApproval += 1
    Write-Host "Skipped without user approval:" $file.Name
    continue
  }

  $publicText = $text
  $publicText = $publicText -replace "\[\[([^\]\|]+)\|([^\]]+)\]\]", '$2'
  $publicText = $publicText -replace "\[\[([^\]]+)\]\]", '$1'
  $publicText = $publicText -replace "(?m)^ready_source:.*\r?\n", ""
  $publicText = $publicText -replace "(?m)^source_draft:.*\r?\n", ""
  $publicText = $publicText -replace "(?m)^quartz_user_approved:.*\r?\n", ""
  $publicText = $publicText -replace "(?m)^quartz_user_approved_at:.*\r?\n", ""
  $publicText = $publicText -replace "(?m)^quartz_user_approval_note:.*\r?\n", ""

  if ($publicText -match "^---\s*\r?\n([\s\S]*?)\r?\n---") {
    $frontmatter = $Matches[1]
    if ($frontmatter -notmatch "(?m)^title:") {
      $title = ""
      if ($publicText -match "(?m)^#\s+(.+)$") {
        $title = $Matches[1].Trim()
      }
      if ($title) {
        $publicText = $publicText -replace "^---\s*\r?\n", "---`ntitle: $title`n"
      }
    }
  }

  $targetPath = Join-Path $targetRoot $file.Name
  Set-Content -LiteralPath $targetPath -Value $publicText -Encoding UTF8
  $synced += 1
}

Write-Host "Synced approved published files:" $synced
Write-Host "Skipped pending user approval:" $skippedApproval

if ($writerNotify) {
  if ($skippedApproval -gt 0) {
    & $writerNotify.Path `
      -Stage "quartz-sync" `
      -Status "APPROVAL REQUIRED" `
      -Message "Quartz 동기화에서 사용자 승인 전 파일 $skippedApproval개를 보류했습니다. Obsidian Published 파일에 quartz_user_approved: true를 넣어 승인해야 홈페이지로 넘어갑니다."
  }
  elseif ($synced -gt 0) {
    & $writerNotify.Path `
      -Stage "quartz-sync" `
      -Status "DONE" `
      -Message "사용자 승인된 Published 파일 $synced개를 Quartz research로 동기화했습니다. 빌드/배포 확인이 필요합니다."
  }
  else {
    & $writerNotify.Path `
      -Stage "quartz-sync" `
      -Status "NO CHANGE" `
      -Message "Quartz로 동기화할 승인 완료 Published 파일이 없습니다."
  }
}

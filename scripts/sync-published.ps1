param(
  [string]$WikiPublished = "..\Academic_WIKI\06_Published",
  [string]$QuartzResearch = ".\content\research"
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

$sourceRoot = Resolve-Path $WikiPublished
$targetRoot = Resolve-Path $QuartzResearch

$files = Get-ChildItem -LiteralPath $sourceRoot -Filter "*.md" -File

foreach ($file in $files) {
  $text = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8

  if ($text -notmatch "status:\s*published") { continue }
  if ($text -notmatch "quartz_status:\s*ready_for_quartz") { continue }

  $publicText = $text
  $publicText = $publicText -replace "\[\[([^\]\|]+)\|([^\]]+)\]\]", '$2'
  $publicText = $publicText -replace "\[\[([^\]]+)\]\]", '$1'
  $publicText = $publicText -replace "(?m)^ready_source:.*\r?\n", ""
  $publicText = $publicText -replace "(?m)^source_draft:.*\r?\n", ""

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
}

Write-Host "Synced published files:" $files.Count

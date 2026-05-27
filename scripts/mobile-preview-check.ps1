$ErrorActionPreference = "Stop"

$node = "C:\Users\김민조\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$script = Join-Path $PSScriptRoot "mobile-preview-check.mjs"

if (-not (Test-Path -LiteralPath $node)) {
  throw "Node runtime not found: $node"
}

& $node $script

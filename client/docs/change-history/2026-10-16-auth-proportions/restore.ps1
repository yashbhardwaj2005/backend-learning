param([switch]$Restore)
$ErrorActionPreference = 'Stop'

$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..'))
$clientRoot = (Join-Path $projectRoot 'client') + [IO.Path]::DirectorySeparatorChar
$entries = @(Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'files.json') | ConvertFrom-Json)

# Validate every path and later edit before restoring any file.
foreach ($entry in $entries) {
    $target = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.path))
    if (!$target.StartsWith($clientRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Restore is limited to frontend files: $($entry.path)"
    }
    if (!(Test-Path -LiteralPath $target)) { throw "File is missing: $($entry.path)" }
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $entry.afterSha256) {
        throw "File changed after this update. Preserve the newer work before restoring: $($entry.path)"
    }
    if ($entry.beforeSha256) {
        $original = Join-Path $PSScriptRoot "before/$($entry.path)"
        if ((Get-FileHash -LiteralPath $original -Algorithm SHA256).Hash -ne $entry.beforeSha256) {
            throw "Saved original was modified: $($entry.path)"
        }
    }
    Write-Output "$($entry.path) — $(if ($entry.beforeSha256) { 'restore saved original' } else { 'remove file created by this update' })"
}

if (!$Restore) { Write-Output 'Preview only. Add -Restore to apply this frontend rollback.'; return }
foreach ($entry in $entries) {
    $target = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.path))
    if ($entry.beforeSha256) {
        Copy-Item -LiteralPath (Join-Path $PSScriptRoot "before/$($entry.path)") -Destination $target
    } else {
        Remove-Item -LiteralPath $target
    }
}
Add-Content -LiteralPath (Join-Path $projectRoot 'client/CHANGES.md') -Value "`nRollback applied: $(Get-Date -Format 'yyyy-MM-dd HH:mm') — restored the pre-auth-proportions frontend snapshot."
Write-Output 'Frontend restored. Backend and persistent history were preserved.'




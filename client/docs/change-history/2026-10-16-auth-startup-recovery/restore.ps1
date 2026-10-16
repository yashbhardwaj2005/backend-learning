param([switch]$Restore)
$ErrorActionPreference = 'Stop'

$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..'))
$clientRoot = (Join-Path $projectRoot 'client') + [IO.Path]::DirectorySeparatorChar
$allEntries = @(Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'files.json') | ConvertFrom-Json)
$entries = @($allEntries | Where-Object { $_.scope -eq 'frontend' })

# Check every target and saved original before changing anything.
foreach ($entry in $entries) {
    $target = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.path))
    if (!$target.StartsWith($clientRoot, [StringComparison]::OrdinalIgnoreCase)) {
        throw "Restore is limited to frontend files: $($entry.path)"
    }
    if (!(Test-Path -LiteralPath $target)) { throw "File is missing: $($entry.path)" }
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $entry.afterSha256) {
        throw "File changed after this update. Preserve newer work first: $($entry.path)"
    }
    if ($entry.beforeSha256) {
        $original = Join-Path $PSScriptRoot "before/$($entry.path)"
        if ((Get-FileHash -LiteralPath $original -Algorithm SHA256).Hash -ne $entry.beforeSha256) {
            throw "Saved original was modified: $($entry.path)"
        }
    }
    Write-Output "$($entry.path) - $(if ($entry.beforeSha256) { 'restore saved original' } else { 'remove file created by this update' })"
}

Write-Output 'Backend source, hosted settings, review documents and change history are preserved. Backend/Render rollback requires fresh approval.'
if (!$Restore) { Write-Output 'Preview only. Add -Restore to apply the frontend rollback.'; return }
foreach ($entry in $entries) {
    $target = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.path))
    if ($entry.beforeSha256) {
        Copy-Item -LiteralPath (Join-Path $PSScriptRoot "before/$($entry.path)") -Destination $target
    } else {
        Remove-Item -LiteralPath $target
    }
}
Add-Content -LiteralPath (Join-Path $projectRoot 'client/CHANGES.md') -Value "`nRollback applied: $(Get-Date -Format 'yyyy-MM-dd HH:mm') - restored the pre-startup-recovery frontend snapshot. Backend and hosting settings were preserved."
Write-Output 'Frontend restored. A published rollback also needs a commit/redeploy.'

param([switch]$Restore)
$ErrorActionPreference = 'Stop'

$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..'))
$clientRoot = (Join-Path $projectRoot 'client') + [IO.Path]::DirectorySeparatorChar
$entries = @(Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'files.json') | ConvertFrom-Json)

# Validate every path and later edit before restoring any file.
foreach ($entry in $entries) {
    $target = [IO.Path]::GetFullPath((Join-Path $projectRoot $entry.path))
    # This publishing snapshot only restores the exact repository metadata files.
    $allowedTargets = @((Join-Path $projectRoot '.gitignore'), (Join-Path $projectRoot 'readme.md'), (Join-Path $projectRoot '.gitattributes'))
    if ($target -notin $allowedTargets) {
        throw "Restore is limited to the saved README, Git ignore rules and Git attributes: $($entry.path)"
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
Add-Content -LiteralPath (Join-Path $projectRoot 'client/CHANGES.md') -Value "`nRollback applied: $(Get-Date -Format 'yyyy-MM-dd HH:mm') — restored the pre-GitHub-upload README and Git ignore snapshot."
Write-Output 'Saved repository documentation/ignore rules restored. Backend and history were preserved.'






param(
    [Parameter(Mandatory = $true)]
    [string]$SourcePath,

    [string]$Name,

    [string]$Message,

    [switch]$NoPush
)

$ErrorActionPreference = 'Stop'

function Assert-Command($cmd) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        throw "Required command '$cmd' is not available in PATH."
    }
}

Assert-Command git

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
Push-Location $repoRoot

try {
    $isRepo = git rev-parse --is-inside-work-tree 2>$null
    if ($LASTEXITCODE -ne 0 -or $isRepo -ne 'true') {
        throw 'Current directory is not a git repository.'
    }

    if (-not (Test-Path $SourcePath)) {
        throw "Source file not found: $SourcePath"
    }

    $source = Get-Item $SourcePath
    $assetsDir = Join-Path $repoRoot 'assets/img'
    if (-not (Test-Path $assetsDir)) {
        New-Item -ItemType Directory -Path $assetsDir | Out-Null
    }

    $inputName = if ($Name) { $Name } else { [System.IO.Path]::GetFileNameWithoutExtension($source.Name) }
    $ext = [System.IO.Path]::GetExtension($source.Name).ToLowerInvariant()

    $safeBase = ($inputName.ToLowerInvariant() -replace '[^a-z0-9._-]', '-') -replace '-{2,}', '-'
    $safeBase = $safeBase.Trim('-','.')
    if ([string]::IsNullOrWhiteSpace($safeBase)) {
        $safeBase = 'asset-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
    }

    $destName = "$safeBase$ext"
    $destPath = Join-Path $assetsDir $destName

    if (Test-Path $destPath) {
        throw "Target already exists: assets/img/$destName. Use -Name with another value."
    }

    Copy-Item -LiteralPath $source.FullName -Destination $destPath

    git add -- "assets/img/$destName"

    $commitMessage = if ($Message) { $Message } else { "chore(assets): add $destName" }
    git commit -m $commitMessage

    $branch = (git rev-parse --abbrev-ref HEAD).Trim()

    if (-not $NoPush) {
        git push origin $branch
    }

    $remote = (git remote get-url origin).Trim()
    if ($remote -match 'github.com[:/](?<owner>[^/]+)/(?<repo>[^/.]+)(\.git)?$') {
        $owner = $Matches.owner
        $repo = $Matches.repo
        $repoUrl = "https://github.com/$owner/$repo/blob/$branch/assets/img/$destName"
        $rawUrlBranch = "https://raw.githubusercontent.com/$owner/$repo/$branch/assets/img/$destName"
        $rawUrlMain = "https://raw.githubusercontent.com/$owner/$repo/main/assets/img/$destName"
        $pagesUrl = "https://$owner.github.io/$repo/assets/img/$destName"
        Write-Host ''
        Write-Host 'Asset published successfully.' -ForegroundColor Green
        Write-Host "File: assets/img/$destName"
        Write-Host "GitHub URL: $repoUrl"
        Write-Host "Raw URL (branch): $rawUrlBranch"
        Write-Host "Raw URL (main): $rawUrlMain"
        Write-Host "Pages URL (if file is in published branch): $pagesUrl"
    } else {
        Write-Host ''
        Write-Host 'Asset published successfully, but remote origin is not a standard GitHub URL.' -ForegroundColor Yellow
        Write-Host "File: assets/img/$destName"
    }
}
finally {
    Pop-Location
}

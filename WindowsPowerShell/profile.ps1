Import-Module PathUtils

Add-Path -Directory "${env:ProgramFiles(x86)}\Git\bin"

Import-Module posh-git

function global:prompt {
    $realLASTEXITCODE = $LASTEXITCODE
    $Host.UI.RawUI.ForegroundColor = $GitPromptSettings.DefaultForegroundColor
    Write-Host($pwd.ProviderPath) -nonewline
    Write-VcsStatus
    $global:LASTEXITCODE = $realLASTEXITCODE
    return "> "
}

Enable-GitColors
Start-SshAgent -Quiet

function Add-Path {
  <#
    .SYNOPSIS
      Adds a Directory to the Current Path
    .DESCRIPTION
      Add a directory to the current path.  This is useful for 
      temporary changes to the path or, when run from your 
      profile, for adjusting the path within your powershell 
      prompt.
    .EXAMPLE
      Add-Path -Directory "C:\Program Files\Notepad++"
    .PARAMETER Directory
      The name of the directory to add to the current path.
  #>

  [CmdletBinding()]
  param (
    [Parameter(
      Mandatory=$True,
      ValueFromPipeline=$True,
      ValueFromPipelineByPropertyName=$True,
      HelpMessage='What directory would you like to add?')]
    [Alias('dir')]
    [string[]]$Directory
  )

  PROCESS {
    $Path = $env:PATH.Split(';')

    foreach ($dir in $Directory) {
      if ($Path -contains $dir) {
        Write-Verbose "$dir is already present in PATH"
      } else {
        if (-not (Test-Path $dir)) {
          Write-Verbose "$dir does not exist in the filesystem"
        } else {
          $Path += $dir
        }
      }
    }

    $env:PATH = [String]::Join(';', $Path)
  }
}

Export-ModuleMember -Function Add-Path

function Save-Path {
    <#
    .SYNOPSIS
        Saves the current path to the Environment
    .DESCRIPTION
        Add-Path is only temporary.  To make the path permanent,
        use Set-Path
    .EXAMPLE
        Set-Path -Environment User
    #>

    [CmdletBinding()]
    param (
        # Specify the environment that the path should be written to
        [Parameter()]
        [ValidateSet("User","Machine")]
        [string] $Environment = "User"
    )

    process
    {
        $target = [System.EnvironmentVariableTarget]::User
        if ($Environment -eq "System") {
            $target = [System.EnvironmentVariableTarget]::Machine
        }

        [Environment]::SetEnvironmentVariable("Path", $env:Path, $target)
    }
}

Export-ModuleMember -Function Save-Path

function Get-Path {
    <#
    .SYNOPSIS
        Gets the current Path (as an array of objects)
    .DESCRIPTION
        Returns the list of directories in the current path.  
    .EXAMPLE
        Get-Path
    #>

    [CmdletBinding()]
    param(
        
    )


    process
    {
        $env:Path.split(";") | Write-Output
    }
}

Export-ModuleMember -Function Get-Path

function Set-Path {
    <#
    .SYNOPSIS
        Sets the current path based on the incoming list of directories
    .DESCRIPTION
        Given a list of directories, sets the current path to the list of
        directories
    .EXAMPLE
        Get-Path | Select -Unique | Set-Path
    #>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$True,ValueFromPipeline=$True)]
        [Alias("dir")]
        [string[]] $Path
    )

    begin
    {
        $cpath = ""
    }

    process
    {
        foreach ($p in $Path) {
            if ($cpath -ne "") {
                $cpath += ";";
            } 
            $cpath += $p;
        }    
    }

    end
    {
        $env:Path = $cpath
        $env:Path | Write-Output
    }
}

Export-ModuleMember -Function Set-Path

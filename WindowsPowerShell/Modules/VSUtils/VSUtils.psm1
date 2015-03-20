<#
.Synopsis
   Clone an ASP.NET vNext Project with a new name
.DESCRIPTION
   Takes an existing ASP.NET vNext Project and clones it into
   a new project directory, changing the name of the project in
   all the right files.
.EXAMPLE
   A simple example of cloning a base project into MyProject

   Copy-VSProject -Source .\BaseProject -Destination .\MyProject
.EXAMPLE
   Don't copy node_modules and jspm_modules to the target

   Copy-VSProject -Source .\BaseProject -Destination .\MyProject -Exclude @("node_modules","jspm_modules")
.NOTES
   The project name is obtained from the directory name.  Both
   Source and Destination must be directories.  Internal references
   to the destination project are updated.
#>
function Copy-VSProject
{
    [CmdletBinding()]
    Param
    (
        # The source project.  This should be a directory containing
        # a project.json file.
        [Parameter(Mandatory=$true,Position=0)]
        [ValidateNotNullOrEmpty()]
        [ValidateScript({Test-Path $_ -PathType "Container"})]
        [Alias("src")]
        $Source,

        # The destination project.  This should be a directory name
        # that does not exist.
        [Parameter(Mandatory=$true,Position=1)]
        [ValidateNotNullOrEmpty()]
        [ValidateScript({!(Test-Path $_)})]
        [Alias("dest")]
        [string]
        $Destination,

        # Ignore a set of directories (and their contents).  This can be
        # used to not copy common build directories.  The default set is
        # node_modules, bower_components, bin, obj
        [Parameter(Mandatory=$false)]
        [string[]]
        $Exclude = @( "node_modules", "bower_components", "bin", "obj" )
    )

    Process
    {
        Write-Verbose "[Copy-VSProject] Checking that $Source is on the FileSystem"
        $SrcPath = Resolve-Path -Path $Source
        if ($SrcPath.Provider.Name -ne "FileSystem") {
            throw "Source must be on a FileSystem"
        }

        Write-Verbose "[Copy-VSProject] Initiating Clone of Project $($SrcPath.Path)"

        Write-Verbose "[Copy-VSProject] Copying Files... (Exclude Length = $($Exclude.Length))"
        # Note that -Recurse and -Exclude do not work together on Copy-Item
        # See https://connect.microsoft.com/PowerShell/feedback/details/698513
        # This is the workaround - first get the list of files
        if ($Exclude.length -gt 0) {
            $regexp = "(" + (($Exclude | %{ "\\$_\\" }) -join "|") + ")"
            Write-Verbose "[Copy-VSProject] Excluding via regular expression: $regexp"
            $files = (Get-ChildItem -Path $SrcPath.Path -Recurse -ErrorAction SilentlyContinue | ? {
                $_.FullName.Substring($SrcPath.Path.Length) -notmatch $regexp
            });
        } else {
            $files = Get-ChildItem -Path $SrcPath.Path -Recurse -ErrorAction SilentlyContinue
        }
        Write-Verbose "[Copy-VSProject] Found $($files.Length) files and directories to copy"
        Write-Debug "Continue with copying process?"

        # Then copy the files to the new location
        $files | Foreach-Object { 
            $target = Join-Path $Destination $_.FullName.Substring($SrcPath.Path.Length)
            Write-Verbose "Copying $($_.FullName) to $target"
            Copy-Item -Path $_.FullName -Destination $target 
        }
        Write-Verbose "[Copy-VSProject] Finished Copying Files..."

        # Convert the destination to an absolute path
        $DestPath = Resolve-Path -Path $Destination
        Write-Verbose "Destination Path is $($DestPath.Path)"

        # Extract the project names
        $SrcProject = Split-Path -Leaf $SrcPath.Path
        $DstProject = Split-Path -Leaf $DestPath.Path
        Write-Verbose "[Copy-VSProject] Convert Project `"$SrcProject`" into Project `"$DstProject`""
        $prjFiles = Get-ChildItem -Path $DestPath.Path -File -Recurse | Select-String -SimpleMatch -Pattern $SrcProject
        Write-Verbose "[Copy-VSProject] Found $($prjFiles.Length) files with a reference to source project"
        Write-Debug "Continue with Conversion process?"
        foreach ($file in $prjFiles) {
            Write-Verbose "[Copy-VSProject] Updating project reference in $($file.Path)"
            (Get-Content $file.Path) | %{ $_ -replace $SrcProject,$DstProject } | Set-Content $file.Path
        }
        
        Write-Verbose "[Copy-VSProject] Clone of Project $($SrcPath.Path) is complete"
    }
    End
    {
    }
}
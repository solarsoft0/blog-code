<#
.Synopsis
   Create an authentication token for Skytap
.DESCRIPTION
   The Skytap REST API requires that you authenticate with either
   your username and password OR an API Token.  This cmdlet converts
   either a PSCrendential or an API Token to the appropriate form
   for the other cmdlets.
.EXAMPLE
   To authenticate with Username and Password:

   $token = Get-SkytapAuthToken -Credentials (Get-Credential -Message "Enter Skytap Credentials")
.EXAMPLE
   To authenticate with an API Token

   $token = Get-SkytapAuthToken -APIToken $apiToken
.OUTPUTS
   Outputs a string to pass into other Skytap cmdlets
.NOTES
   No validation is done
.COMPONENT
   Skytap REST API
#>
function Get-SkytapAuthToken
{
    [CmdletBinding(DefaultParameterSetName='Username and Password')]
    [OutputType([string])]
    Param
    (
        # The PSCredential with the username and password
        [Parameter(Mandatory=$true, ParameterSetName='Username and Password')]
        [ValidateNotNullOrEmpty()]
        [PSCredential] $Credentials,

        # The API Token from the Skytap API
        [Parameter(Mandatory=$true, ParameterSetName='API Token')]
        [string] $APIToken,

        # The username from the Skytap API
        [Parameter(Mandatory=$true, ParameterSetName='API Token')]
        [string] $Username
    )

    Process
    {
        switch ($PsCmdlet.ParameterSetName)
        {
            "Username and Password" {
                $username = $Credentials.UserName
                $password = $Credentials.GetNetworkCredential().Password
                $authtoken = "$($username):$($password)"
                break
            }
            "API Token" {
                $authtoken = "$($username):$($APIToken)"
                break
            }
        }

        $bytes = [System.Text.Encoding]::UTF8.GetBytes($authtoken)
        $base64 = [System.Convert]::ToBase64String($bytes)
        Write-Output "Basic $($base64)"
    }
}

<#
.Synopsis
   Do a web request to the Skytap Cloud and convert the JSON response to
   a PSObject array
.DESCRIPTION
    This cmdlet is a helper for handling Skytap Cloud.  It does an appropriate
    method call to the REST API and converts the response to PSObject.
.EXAMPLE
    Get the list of templates:

    Invoke-SkytapRESTMethod -AuthToken $authToken -Method GET -Path "/templates"
.OUTPUTS
   Outputs a list of PSObjects with the information.
.COMPONENT
   Skytap REST API
#>
function Invoke-SkytapRESTMethod
{
    [CmdletBinding()]
    [OutputType([PSObject])]
    Param
    (
        # The Auth Token - use Get-SkytapAuthToken to generate this
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string] $AuthToken,

        # The REST Method (Default: GET)
        [Parameter()]
        [ValidateSet("GET", "POST", "PUT", "DELETE")]
        [string] $Method = "GET",

        # The path to be submitted
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string] $Path
    )

    Begin
    {
        $SkytapAPI = "https://cloud.skytap.com"
    }
    Process
    {
        $Headers = @{ Authorization = $AuthToken; Accept = "application/json" }
        $r = Invoke-WebRequest -Uri "$($SkytapAPI)$($Path)" -Method $Method -Headers $Headers
        $r.Content | ConvertFrom-Json | Write-Output
    }
}

<#
.Synopsis
   Request a list of templates from the Skytap API
.DESCRIPTION
    Using the provided auth token, request a list of templates from the Skytap API
    and return them as custom objects.
.EXAMPLE
    Get-SkytapTemplates -AuthToken $token -Filter "name=Ubuntu Desktop 14.04 - 64-bit"
.OUTPUTS
   Outputs a list of PSObjects with the information.
.COMPONENT
   Skytap REST API
#>
function Get-SkytapTemplates
{
    [CmdletBinding()]
    [OutputType([PSObject])]
    Param
    (
        # The Auth Token - use Get-SkytapAuthToken to generate this
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string] $AuthToken,

        # Optional filter for the templates.  Use key=value
        [Parameter()]
        [string] $Filter = ""
    )

    Process
    {
        $QueryString = ""
        if ($Filter -ne "") {
            $QueryString = "?" + [System.Web.HttpUtility]::UrlEncode($Filter)
        }
        Invoke-SkytapRESTMethod -AuthToken $AuthToken -Path "/templates$($QueryString)"
    }
}

<#
.Synopsis
   Request a list of templates from the Skytap API
.DESCRIPTION
    Using the provided auth token, create a new skytap environment based
    on the provided template
.EXAMPLE
    New-SkytapEnvironment -AuthToken $token -Template $ubuntu
.OUTPUTS
   Outputs a list of PSObjects with the information.
.COMPONENT
   Skytap REST API
#>
function New-SkytapEnvironment
{
    [CmdletBinding()]
    [OutputType([PSObject])]
    Param
    (
        # The Auth Token - use Get-SkytapAuthToken to generate this
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string] $AuthToken,

        # Template to be used - object only needs an id field
        [Parameter(ValueFromPipeline=$true)]
        $Template
    )

    Process
    {
        Invoke-SkytapRESTMethod -AuthToken $AuthToken -Method POST -Path "/configurations?template_id=$($Template.id)"
    }
}

<#
.Synopsis
   Request a list of environments from the Skytap API
.DESCRIPTION
    Using the provided auth token, request a list of environments from the Skytap API
    and return them as custom objects.
.EXAMPLE
    Get-SkytapEnvironment -AuthToken $token
.OUTPUTS
   Outputs a list of PSObjects with the information.
.COMPONENT
   Skytap REST API
#>
function Get-SkytapEnvironment
{
    [CmdletBinding()]
    [OutputType([PSObject])]
    Param
    (
        # The Auth Token - use Get-SkytapAuthToken to generate this
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string] $AuthToken,

        # Get a specific environment by ID
        [Parameter()]
        [string] $EnvironmentID = ""
    )

    Process
    {
        $QueryString = ""
        if ($EnvironmentID -ne "") {
            $QueryString = "/$EnvironmentID"
        }
        Invoke-SkytapRESTMethod -AuthToken $AuthToken -Method GET -Path "/configurations$QueryString"
    }
}

<#
.Synopsis
   Change certain fields on the specified Skytap environment
.DESCRIPTION
    Using the provided auth token, change any rw fields from the list
.EXAMPLE
    Set-SkytapEnvironment -AuthToken $token -EnvironmentID 3960204 -Name "New Configuration"
.OUTPUTS
   Outputs the resulting configuration object
.COMPONENT
   Skytap REST API
#>
function Set-SkytapEnvironment
{
    [CmdletBinding()]
    [OutputType([PSObject])]
    Param
    (
        # The Auth Token - use Get-SkytapAuthToken to generate this
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string] $AuthToken,

        # Get a specific environment by ID
        [Parameter(Mandatory=$true)]
        [string] $EnvironmentID,

        # Set the friendly name
        [Parameter()]
        [string] $Name = $null
    )

    Process
    {
        $QueryString = "/$($EnvironmentID)?"
        $Sep = "";

        if ($Name -ne $null) {
            $QueryString = $QueryString + $Sep + "name=" + [System.Web.HttpUtility]::UrlPathEncode($Name);
            $Sep = "&";
        }
        
        Invoke-SkytapRESTMethod -AuthToken $AuthToken -Method PUT -Path "/configurations$QueryString"
    }
}

<#
.Synopsis
   Add a template to the specified skytap environment
.DESCRIPTION
    Using the provided auth token, merge a template definition into the specified environment.
    This adds the VMs, but none of the networking characteristics.
.EXAMPLE
    Add-SkytapVM -AuthToken $token -EnvironmentID 3960204 -Template $u
.OUTPUTS
   Outputs the resulting configuration object
.COMPONENT
   Skytap REST API
#>
function Add-SkytapVM
{
    [CmdletBinding()]
    [OutputType([PSObject])]
    Param
    (
        # The Auth Token - use Get-SkytapAuthToken to generate this
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string] $AuthToken,

        # Get a specific environment by ID
        [Parameter(Mandatory=$true)]
        [string] $EnvironmentID,

        # Set the friendly name
        [Parameter(Mandatory=$true)]
        $Template
    )

    Process
    {            
        $path = "/configurations/$($EnvironmentID)?template_id=$($Template.id)"
        Invoke-SkytapRESTMethod -AuthToken $AuthToken -Method PUT -Path $path
    }
}
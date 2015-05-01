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
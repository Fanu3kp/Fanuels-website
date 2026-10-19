# DuckDNS IP Updater for Otuya Global
# 
# This script updates the DuckDNS A record for otuyaglobal.duckdns.org
# to point to your current public IP address.
#
# USAGE:
#   1. Get your DuckDNS token from https://www.duckdns.org/
#   2. Save it in a file: C:\Config\duckdns-token.txt  (one line, just the token)
#   3. Run this script periodically (Task Scheduler recommended, every 12 min)
#      DuckDNS rate limit: 5 updates per hour → 12 min interval = 5/hour
#
# The token file location can be overridden with the DUCKDNS_TOKEN_FILE env var.

param(
    [string]$TokenFile = $env:DUCKDNS_TOKEN_FILE,
    [string]$Domain = "otuyaglobal",
    [string]$IpAddress = ""
)

if (-not $TokenFile) {
    $TokenFile = "C:\Config\duckdns-token.txt"
}

if (-not (Test-Path $TokenFile)) {
    Write-Error "DuckDNS token file not found: $TokenFile"
    Write-Host "Create this file and add your DuckDNS token (one line, no quotes)."
    Write-Host "Get the token at: https://www.duckdns.org/"
    exit 1
}

$Token = Get-Content $TokenFile -Raw
$Token = $Token.Trim()

if (-not $Token -or $Token.Length -lt 10) {
    Write-Error "Invalid DuckDNS token in $TokenFile"
    exit 1
}

if (-not $IpAddress) {
    try {
        $IpAddress = Invoke-RestMethod -Uri 'https://api.ipify.org' -TimeoutSec 10
    } catch {
        Write-Error "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Failed to detect public IP: $($_.Exception.Message)"
        exit 1
    }
}

$Url = "https://www.duckdns.org/update?domains=$Domain&token=$Token&ip=$IpAddress"

try {
    $Result = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 15
    if ($Result -eq "OK") {
        Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - DuckDNS updated successfully. $Domain -> $IpAddress"
    } else {
        Write-Warning "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - DuckDNS returned: $Result"
    }
} catch {
    Write-Error "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - DuckDNS update failed: $($_.Exception.Message)"
}

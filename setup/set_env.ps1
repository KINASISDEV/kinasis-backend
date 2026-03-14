param(
  [Parameter(Mandatory = $true)]
  [string]$EnvFile
)

Get-Content $EnvFile | ForEach-Object {
  $line = $_.Trim()

  if (-not $line -or $line.StartsWith('#')) {
    return
  }

  if ($line -match '^export\s+([^=]+)=(.*)$') {
    $name = $Matches[1].Trim()
    $value = $Matches[2].Trim()
    Set-Item -Path "Env:$name" -Value $value
  }
}

Write-Host "Variables cargadas desde $EnvFile"
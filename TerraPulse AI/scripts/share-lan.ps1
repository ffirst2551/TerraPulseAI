param(
    [int]$Port = 8080
)

$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "Python not found. Please install Python 3 first." -ForegroundColor Red
    exit 1
}

$hostIPs = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
    Where-Object { $_.AddressFamily -eq [System.Net.Sockets.AddressFamily]::InterNetwork -and $_.IPAddressToString -ne "127.0.0.1" } |
    Select-Object -ExpandProperty IPAddressToString

Write-Host ""
Write-Host "TerraPulse local share server started." -ForegroundColor Green
Write-Host "Local:   http://localhost:$Port"
if ($hostIPs) {
    foreach ($ip in $hostIPs) {
        Write-Host "LAN:     http://$ip`:$Port"
    }
}
Write-Host "Press Ctrl+C to stop."
Write-Host ""

python -m http.server $Port --bind 0.0.0.0


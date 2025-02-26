# PowerShell script to start a server accessible on the local network
# Make sure to run this from the project root directory

# Get the local IP address
$localIP = (Get-NetIPAddress | Where-Object { $_.AddressFamily -eq 'IPv4' -and $_.PrefixOrigin -eq 'Dhcp' }).IPAddress

if (-not $localIP) {
    # Try alternative method to get IP
    $localIP = (Get-NetIPAddress | Where-Object { $_.AddressFamily -eq 'IPv4' -and $_.InterfaceAlias -match 'Ethernet|Wi-Fi' -and $_.IPAddress -notmatch '^169\.254' }).IPAddress
}

if (-not $localIP) {
    Write-Host "Could not determine local IP address. Using localhost instead."
    $localIP = "localhost"
} else {
    Write-Host "Your local IP address is: $localIP"
}

# Stop any running Next.js server
Write-Host "Stopping any running Next.js server..."
taskkill /F /IM node.exe 2>$null

# Start the Next.js server on the network
Write-Host "Starting Next.js server on the network..."
Write-Host "Your app will be accessible at: http://$($localIP):3000"
Write-Host "Share this URL with your colleague who is on the same network."
Write-Host "Press Ctrl+C to stop the server."

# Start the server with the host option
npm run build
npx next start -H $localIP 
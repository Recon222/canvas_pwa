# PowerShell script to deploy to Vercel
# Make sure to run this from the project root directory

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI is not installed. Installing now..."
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..."
vercel --prod

Write-Host "Done! Your app has been deployed to Vercel."
Write-Host "You can share the URL with your colleague."
Write-Host "Note: The first time you run this, you'll need to authenticate with Vercel and set up your project." 
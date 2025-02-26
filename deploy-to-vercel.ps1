# PowerShell script to deploy to Vercel
# Make sure to run this from the project root directory

Write-Host "===== POLICE CANVASS PWA - VERCEL DEPLOYMENT =====" -ForegroundColor Cyan
Write-Host "This script will help you deploy your PWA to Vercel." -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    # Command not found
}

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI is not installed. Installing now..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "Vercel CLI installed successfully!" -ForegroundColor Green
}

# Deploy to Vercel
Write-Host "`nDeploying to Vercel..." -ForegroundColor Cyan
Write-Host "Follow the prompts to complete the deployment." -ForegroundColor Cyan
Write-Host "For first-time deployment, you'll need to:" -ForegroundColor Cyan
Write-Host "  1. Log in to or create a Vercel account" -ForegroundColor Cyan
Write-Host "  2. Connect to your GitHub (recommended) or continue with email" -ForegroundColor Cyan
Write-Host "  3. Set up your project settings" -ForegroundColor Cyan
Write-Host "`nStarting deployment..." -ForegroundColor Green

# Run Vercel deployment with interactive prompts
vercel --prod

Write-Host "`n===========================================" -ForegroundColor Cyan
Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "If you don't see your project in the dashboard:" -ForegroundColor Cyan
Write-Host "1. Try refreshing the Vercel dashboard" -ForegroundColor Cyan
Write-Host "2. Make sure you're logged into the correct Vercel account" -ForegroundColor Cyan
Write-Host "3. Check the terminal output above for any error messages" -ForegroundColor Cyan
Write-Host "`nTo add password protection after deployment:" -ForegroundColor Cyan
Write-Host "1. Go to your Vercel dashboard (https://vercel.com/dashboard)" -ForegroundColor Cyan
Write-Host "2. Select your project" -ForegroundColor Cyan
Write-Host "3. Go to 'Settings' → 'Authentication'" -ForegroundColor Cyan
Write-Host "4. Enable password protection there" -ForegroundColor Cyan 
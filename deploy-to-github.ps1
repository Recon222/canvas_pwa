# PowerShell script to deploy to GitHub
# Make sure to run this from the project root directory

# Check if git is initialized
if (-not (Test-Path -Path ".git")) {
    Write-Host "Initializing git repository..."
    git init
    
    # Ask for GitHub repository URL
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"
    
    # Add remote origin
    git remote add origin $repoUrl
} else {
    Write-Host "Git repository already initialized."
}

# Add all files
git add .

# Commit changes
$commitMessage = Read-Host "Enter commit message (default: 'Update PWA application')"
if (-not $commitMessage) {
    $commitMessage = "Update PWA application"
}
git commit -m $commitMessage

# Push to GitHub
$branch = "main"
Write-Host "Pushing to $branch branch..."
git push -u origin $branch

Write-Host "Done! Your code has been pushed to GitHub."
Write-Host "GitHub Pages will automatically deploy your site if you've enabled GitHub Pages in your repository settings."
Write-Host "To enable GitHub Pages:"
Write-Host "1. Go to your repository on GitHub"
Write-Host "2. Click on 'Settings'"
Write-Host "3. Navigate to 'Pages' in the sidebar"
Write-Host "4. Under 'Build and deployment', select 'GitHub Actions' as the source"
Write-Host "5. Your site will be available at https://[username].github.io/[repository-name]/" 
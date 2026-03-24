# Start Backend
Start-Process -FilePath "py" -ArgumentList "run.py" -WorkingDirectory "backend" -WindowStyle Normal

# Start Frontend
Start-Process -FilePath "cmd" -ArgumentList "/c npm run dev" -WorkingDirectory "frontend" -WindowStyle Normal

Write-Host "Application started! Backend running on http://localhost:5000, Frontend on http://localhost:5173"

$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "Development server running on http://localhost:$port/"
    Write-Host "Press Ctrl+C to stop."
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response
        
        # Ensure we decode URLs (like %20 to spaces) so folders like "master barbershop" work
        Add-Type -AssemblyName System.Web
        $path = [System.Web.HttpUtility]::UrlDecode($req.Url.LocalPath)
        $path = $path.Replace("/", "\").TrimStart("\")
        
        # If they hit the root, redirect to the primeweb index so relative paths work
        if ($path -eq "") { 
            $res.Redirect("/primeweb/index.html")
            $res.Close()
            continue 
        }
        
        # Resolve path relative to the workspace root!
        $workspacePath = "C:\Users\vroyn\OneDrive\Desktop\davids personal website"
        $fullPath = Join-Path $workspacePath $path
        
        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $mime = "application/octet-stream"
            switch ($ext) {
                ".html" { $mime = "text/html" }
                ".css"  { $mime = "text/css" }
                ".js"   { $mime = "application/javascript" }
                ".png"  { $mime = "image/png" }
                ".jpg"  { $mime = "image/jpeg" }
                ".jpeg" { $mime = "image/jpeg" }
                ".svg"  { $mime = "image/svg+xml" }
                ".woff2" { $mime = "font/woff2" }
            }
            $res.ContentType = $mime
            
            try {
                $bytes = [System.IO.File]::ReadAllBytes($fullPath)
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $res.StatusCode = 500
            }
        } else {
            $res.StatusCode = 404
        }
        $res.Close()
    }
} catch {
    Write-Host "Error starting server: $_"
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}

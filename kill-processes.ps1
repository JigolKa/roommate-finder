$python = Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
$go = Get-Process -Id (Get-NetTCPConnection -LocalPort 5001).OwningProcess
$node = Get-Process -Id (Get-NetTCPConnection -LocalPort 5002).OwningProcess

taskkill.exe /PID $python.Id -f
taskkill.exe /PID $go.Id -f
taskkill.exe /PID $node.Id -f
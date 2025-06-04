@echo off
REM Get latest commit SHA
for /f %%i in ('git rev-parse HEAD') do set SHA=%%i

REM Target file
set TARGET=new-tab.js

REM Replace first line with const current_sha = '<SHA>';
powershell -Command ^
  "(Get-Content %TARGET%) | ForEach-Object -Begin { $i=0 } -Process { $i++; if ($i -eq 1) {\"const current_sha = '%SHA%';\"} else {$_} } | Set-Content %TARGET%"

REM Stage updated file for next commit (optional)
git add %TARGET%

echo Updated new-tab.js with SHA: %SHA%

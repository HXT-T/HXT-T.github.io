@echo off
chcp 65001 >nul
echo ========================================
echo   博客推送脚本 - HXT Blog
echo ========================================
echo.

cd /d "C:\Users\hua_xu\Documents\kimi\workspace\hxt-t.github.io"

echo [1/3] 检查本地更改...
git status --short

echo.
echo [2/3] 添加所有更改...
git add .

echo.
set /p msg="输入提交信息（直接回车使用默认）: "
if "%msg%"=="" set msg="更新博客内容"

git commit -m "%msg%"

echo.
echo [3/3] 推送到 GitHub...
git push origin main

echo.
if %errorlevel%==0 (
    echo ✅ 推送成功！
    echo 请等待 2-3 分钟后访问 https://hxt-t.github.io
) else (
    echo ❌ 推送失败，请检查网络连接
)

echo.
pause

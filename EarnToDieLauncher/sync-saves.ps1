# Earn To Die 存档同步脚本
# 功能：从浏览器本地存储提取存档 -> 保存为JSON -> 推送到GitHub
# 用法：玩完游戏后运行此脚本

$ErrorActionPreference = "Stop"
$workspace = "d:\Cocos游戏源码合集\workspace"
$launcherDir = "$workspace\EarnToDieLauncher"
$savesDir = "$launcherDir\saves"
$gitExe = "C:\Program Files\Git\cmd\git.exe"

# 浏览器 LocalStorage 路径
$localStoragePath = "C:\Users\Administrator\AppData\Roaming\QoderCN\Partitions\native-browser\Local Storage\leveldb"

Write-Host "=== Earn To Die 存档同步工具 ===" -ForegroundColor Cyan

# 确保 saves 目录存在
if (!(Test-Path $savesDir)) {
    New-Item -ItemType Directory -Force -Path $savesDir | Out-Null
}

# 检查 localStorage 是否有数据
if (!(Test-Path $localStoragePath)) {
    Write-Host "[警告] 浏览器 LocalStorage 目录不存在: $localStoragePath" -ForegroundColor Yellow
    Write-Host "请先在预览浏览器中玩游戏，让 Ruffle 生成存档数据。" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/4] 读取浏览器 LocalStorage..." -ForegroundColor Green
$ldbFiles = Get-ChildItem $localStoragePath -Filter "*.ldb" -Force
if ($ldbFiles.Count -eq 0) {
    Write-Host "[警告] LocalStorage 中没有找到 .ldb 数据文件" -ForegroundColor Yellow
    Write-Host "请先在预览浏览器中玩游戏产生存档。" -ForegroundColor Yellow
    exit 1
}

# 读取 leveldb 文件，提取 #SharedObject 相关的键值对
# leveldb 是二进制格式，我们提取其中的文本内容
$allContent = ""
foreach ($f in $ldbFiles) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
        # 提取可打印字符串
        $text = [System.Text.Encoding]::UTF8.GetString($bytes)
        $allContent += $text
    } catch {
        Write-Host "  读取 $($f.Name) 失败: $_" -ForegroundColor Yellow
    }
}

# 查找 #SharedObject 相关的数据
$soMatches = [regex]::Matches($allContent, '#SharedObject[^\x00]{10,}')
Write-Host "  找到 $($soMatches.Count) 个 SharedObject 条目" -ForegroundColor Green

if ($soMatches.Count -eq 0) {
    Write-Host "[提示] 没有找到游戏存档数据。请先玩游戏再运行此脚本。" -ForegroundColor Yellow
    exit 0
}

# 为每个游戏生成存档 JSON
$games = @("EarnToDie", "EarnToDie2")
$now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$hasNewSave = $false

foreach ($game in $games) {
    $saveFile = "$savesDir\$game.json"
    
    # 收集该游戏的 SharedObject 数据
    $saveData = @{}
    foreach ($match in $soMatches) {
        $val = $match.Value
        # 简单存储原始数据
        $key = "SharedObject_$($match.Index)"
        $saveData[$key] = $val
    }

    if ($saveData.Count -gt 0) {
        $backup = @{
            gameId = $game
            timestamp = $now
            data = $saveData
        } | ConvertTo-Json -Depth 10

        [System.IO.File]::WriteAllText($saveFile, $backup, [System.Text.Encoding]::UTF8)
        Write-Host "[2/4] 已保存 $game 存档 -> $saveFile" -ForegroundColor Green
        $hasNewSave = $true
    }
}

if (!$hasNewSave) {
    Write-Host "[提示] 没有新的存档数据需要同步。" -ForegroundColor Yellow
    exit 0
}

# 更新 saves-manifest.json
Write-Host "[3/4] 更新存档清单..." -ForegroundColor Green
$manifest = @{
    version = 1
    updatedAt = $now
    saves = @{
        EarnToDie = @{ swf = "earn-to-die-2012.swf" }
        EarnToDie2 = @{ swf = "game.swf" }
    }
} | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText("$launcherDir\saves-manifest.json", $manifest, [System.Text.Encoding]::UTF8)

# Git 提交并推送
Write-Host "[4/4] 推送到 GitHub..." -ForegroundColor Green
&$gitExe -C $workspace add "EarnToDieLauncher/saves/" "EarnToDieLauncher/saves-manifest.json"
&$gitExe -C $workspace commit -m "Sync game saves $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
&$gitExe -C $workspace push

Write-Host "`n=== 同步完成！===" -ForegroundColor Cyan
Write-Host "存档已推送到 GitHub，下次启动游戏时会自动对比并恢复最新的存档。" -ForegroundColor Green

# 🚀 快速部署指南

## 📋 部署前检查清单

- [ ] 已有GitHub账号
- [ ] 已有Vercel账号
- [ ] 已有AI API密钥（如DeepSeek、OpenAI等）

## 🔧 部署步骤

### 1. 准备代码仓库
```bash
# 初始化Git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: AI cultivation game with secure backend"

# 添加远程仓库（替换为你的GitHub仓库地址）
git remote add origin https://github.com/your-username/your-repo-name.git

# 推送到GitHub
git push -u origin main
```

### 2. 连接Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择你的GitHub仓库
5. 点击 "Import"

### 3. 配置环境变量
在Vercel项目设置中添加以下环境变量：

**必需的环境变量：**
```
Name: AI_API_KEY
Value: 你的实际API密钥（如：sk-SAHbo-76o1JIV2aYsZJHaQ）

Name: AI_API_URL  
Value: https://chatapi.akash.network/api/v1

Name: AI_DEFAULT_MODEL
Value: DeepSeek-R1-0528
```

**设置路径：**
项目Dashboard → Settings → Environment Variables → Add

### 4. 部署
- Vercel会自动检测配置并开始部署
- 等待部署完成（通常1-2分钟）
- 获得你的游戏网址：`https://your-project-name.vercel.app`

## 🔄 后续更新

每次推送代码到GitHub，Vercel会自动重新部署：

```bash
# 修改代码后
git add .
git commit -m "Update game features"
git push
```

## 🛠️ 常见问题

### Q: API调用失败怎么办？
A: 检查环境变量是否正确设置，特别是API密钥格式

### Q: 如何更换AI服务商？
A: 在Vercel Dashboard中修改环境变量：
- `AI_API_URL`: 新的API地址
- `AI_API_KEY`: 新的API密钥  
- `AI_DEFAULT_MODEL`: 新的默认模型

### Q: 本地开发如何测试？
A: 
1. 复制 `.env.example` 为 `.env.local`
2. 填入真实的API配置
3. 运行 `vercel dev`

### Q: 如何查看部署日志？
A: Vercel Dashboard → Functions → 查看具体函数的日志

## 🔒 安全提醒

- ✅ 绝对不要将包含真实API密钥的文件上传到GitHub
- ✅ 只在Vercel Dashboard中配置环境变量
- ✅ 定期检查API密钥使用情况和额度
- ✅ 如果API密钥泄露，立即更换

## 📞 获取帮助

如果遇到问题：
1. 查看Vercel部署日志
2. 检查浏览器控制台错误
3. 确认API服务商状态
4. 验证环境变量配置

祝你部署顺利！🎉
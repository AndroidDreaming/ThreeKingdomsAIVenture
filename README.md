# 云渺仙途：凡尘篇

一个由AI驱动的沙盒修仙世界文字游戏。

## 项目特点

- 🎮 完全由AI生成的动态剧情
- 🏔️ 丰富的修仙世界观设定
- 🎨 自动生成的场景图片
- 📱 响应式设计，支持移动端
- 🔒 安全的后端API架构

## 技术架构

### 前端
- 纯HTML/CSS/JavaScript
- 响应式设计
- 本地存储用户设置

### 后端 (Vercel Serverless Functions)
- `/api/chat` - 处理AI对话请求
- `/api/models` - 获取可用模型列表
- 环境变量安全存储API密钥

## 部署到Vercel

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd ai-game
```

### 2. 安装Vercel CLI (可选)
```bash
npm i -g vercel
```

### 3. 配置环境变量
⚠️ **重要：环境变量只在Vercel Dashboard中设置，不要创建本地.env文件并上传到GitHub！**

在Vercel Dashboard中设置以下环境变量：

```
AI_API_URL=https://chatapi.akash.network/api/v1
AI_API_KEY=your-actual-api-key-here
AI_DEFAULT_MODEL=DeepSeek-R1-0528
```

或者使用其他AI服务商：
```
# OpenAI
AI_API_URL=https://api.openai.com/v1
AI_API_KEY=sk-your-openai-key
AI_DEFAULT_MODEL=gpt-4

# Anthropic
AI_API_URL=https://api.anthropic.com/v1
AI_API_KEY=sk-ant-your-anthropic-key
AI_DEFAULT_MODEL=claude-3-sonnet-20240229
```

**设置步骤：**
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 Settings → Environment Variables
4. 添加上述环境变量
5. 重新部署项目

### 4. 部署
#### 方法1: 通过Git连接自动部署
1. 将代码推送到GitHub/GitLab/Bitbucket
2. 在Vercel Dashboard中连接你的仓库
3. Vercel会自动检测并部署

#### 方法2: 使用Vercel CLI
```bash
vercel --prod
```

## 本地开发

### 1. 创建本地环境变量文件
```bash
cp .env.example .env.local
```

### 2. 编辑 `.env.local` 文件
```
AI_API_URL=https://chatapi.akash.network/api/v1
AI_API_KEY=your-actual-api-key-here
AI_DEFAULT_MODEL=DeepSeek-R1-0528
```

⚠️ **注意：`.env.local` 文件已在 `.gitignore` 中，不会被上传到GitHub**

### 3. 启动本地开发服务器
```bash
vercel dev
```

或者使用任何静态文件服务器：
```bash
# 使用Python
python -m http.server 3000

# 使用Node.js
npx serve .
```

**本地开发注意事项：**
- 本地开发时需要 `.env.local` 文件
- 生产环境使用Vercel Dashboard中的环境变量
- 绝对不要将包含真实API密钥的 `.env` 文件上传到GitHub

## 🔒 安全特性

### API密钥保护
- ✅ API密钥存储在服务器端环境变量中
- ✅ 前端代码中无任何敏感信息
- ✅ `.gitignore` 防止环境变量文件被上传
- ✅ 支持用户自定义API设置（可选）

### 请求验证
- ✅ 后端API验证请求格式
- ✅ 完善的错误处理和日志记录
- ✅ 防止恶意请求和滥用

### 部署安全
- ✅ 环境变量只在Vercel Dashboard中配置
- ✅ 源代码可以安全地公开在GitHub
- ✅ 生产环境与开发环境隔离

## 游戏特色

### 🎭 动态剧情系统
- AI实时生成独特的故事情节
- 玩家选择影响后续发展
- 丰富的修仙世界观设定

### 📊 角色成长系统
- 境界突破：凡人 → 练气 → 筑基 → 金丹...
- 属性提升：攻击、防御、身法、魅力
- 技能学习：神通、功法收集

### 🏆 成就系统
- 20+种不同类型的成就
- 探索、战斗、社交等多维度挑战
- 隐藏成就等待发现

### 🎒 物品系统
- 法宝、丹药、符箓等修仙道具
- 品阶分级：劣品到仙品
- 动态获得和使用

## 自定义配置

玩家可以在游戏中配置自己的AI API：
- 支持OpenAI、Anthropic、DeepSeek等
- 自定义API URL和密钥
- 模型选择和切换

## 故障排除

### API调用失败
1. 检查环境变量是否正确设置
2. 确认API密钥有效且有足够额度
3. 查看浏览器控制台错误信息

### 图片加载失败
- 图片由Pollinations AI生成，偶尔可能不稳定
- 刷新页面重新生成

### 模型列表为空
- 检查API服务商是否支持models端点
- 某些API可能不提供模型列表功能

## 贡献

欢迎提交Issue和Pull Request来改进游戏！

## 许可证

MIT License
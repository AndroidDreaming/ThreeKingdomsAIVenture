# 🔧 故障排除指南

## 常见问题及解决方案

### 1. FUNCTION_INVOCATION_TIMEOUT 错误

**问题描述：** 请求 `/api/chat` 时出现超时错误

**可能原因：**
- AI API 响应时间过长
- 网络连接不稳定
- API 服务商限流或故障
- Vercel 函数超时设置过短

**解决方案：**

#### A. 检查环境变量配置
确保在 Vercel Dashboard 中正确设置了：
```
AI_API_URL=https://chatapi.akash.network/api/v1
AI_API_KEY=你的有效API密钥
AI_DEFAULT_MODEL=DeepSeek-R1-0528
```

#### B. 验证API密钥
1. 登录你的AI服务商控制台
2. 检查API密钥是否有效
3. 确认账户余额充足
4. 检查是否有使用限制

#### C. 测试API连通性
使用以下命令测试API是否可用：
```bash
curl -X POST "https://chatapi.akash.network/api/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "DeepSeek-R1-0528",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 100
  }'
```

#### D. Pollinations.ai 配置
如果使用 Pollinations.ai，请使用以下配置：

**匿名访问（有速率限制）：**
```bash
AI_API_URL=https://text.pollinations.ai/openai
AI_API_KEY=not-required
AI_DEFAULT_MODEL=openai  # 或 mistral, claude
```

**认证访问（更高速率限制）：**
```bash
AI_API_URL=https://text.pollinations.ai/openai
AI_API_KEY=your-pollinations-token  # 从 https://auth.pollinations.ai 获取
AI_DEFAULT_MODEL=openai
```

测试 Pollinations.ai API（匿名）：
```bash
curl https://text.pollinations.ai/openai \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Hello"}],
    "seed": 42
  }'
```

测试 Pollinations.ai API（认证）：
```bash
curl https://text.pollinations.ai/openai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-pollinations-token" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Hello"}],
    "seed": 42
  }'
```

#### E. 重新部署
1. 在 Vercel Dashboard 中进入项目
2. 点击 "Deployments" 标签
3. 点击最新部署右侧的三个点
4. 选择 "Redeploy"

### 2. API 密钥错误

**错误信息：** `API key not configured` 或 `401 Unauthorized`

**解决方案：**
1. 检查 Vercel 环境变量是否正确设置
2. 确保环境变量名称完全匹配：`AI_API_KEY`
3. 重新部署项目使环境变量生效

### 3. 模型不可用

**错误信息：** `Model not found` 或 `400 Bad Request`

**解决方案：**
1. 检查 `AI_DEFAULT_MODEL` 环境变量
2. 确认模型名称正确（如：`DeepSeek-R1-0528`）
3. 验证你的API密钥是否有权限使用该模型

### 4. 网络连接问题

**症状：** 间歇性超时或连接失败

**解决方案：**
1. 检查本地网络连接
2. 尝试使用不同的网络环境
3. 检查防火墙或代理设置
4. 联系API服务商确认服务状态

## 🔍 调试步骤

### 1. 查看 Vercel 函数日志
1. 进入 Vercel Dashboard
2. 选择你的项目
3. 点击 "Functions" 标签
4. 查看 `api/chat.js` 的执行日志

### 2. 浏览器控制台调试
1. 打开浏览器开发者工具 (F12)
2. 切换到 "Console" 标签
3. 重现问题并查看错误信息
4. 切换到 "Network" 标签查看API请求详情

### 3. 测试不同的API设置
1. 在游戏中尝试配置自定义API
2. 使用不同的AI服务商进行测试
3. 比较响应时间和成功率

## ⚡ 性能优化建议

### 1. 减少请求大小
- 当前已设置 `max_tokens: 2000`
- 可以根据需要进一步调整

### 2. 使用更快的模型
如果当前模型响应较慢，可以尝试：
- `gpt-3.5-turbo`（OpenAI）
- `claude-3-haiku`（Anthropic）
- 其他轻量级模型

### 3. 实现重试机制
考虑在前端添加自动重试功能：
```javascript
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## 📞 获取帮助

如果问题仍然存在：

1. **检查服务状态**
   - [Vercel Status](https://www.vercel-status.com/)
   - 你的AI服务商状态页面

2. **收集错误信息**
   - Vercel 函数日志
   - 浏览器控制台错误
   - 网络请求详情

3. **联系支持**
   - 提供完整的错误信息
   - 说明重现步骤
   - 包含环境配置信息（不要包含API密钥）

## 🚀 预防措施

1. **监控API使用情况**
   - 定期检查API额度和使用量
   - 设置使用量警报

2. **备用API配置**
   - 准备多个AI服务商的API密钥
   - 在主要服务不可用时快速切换

3. **定期测试**
   - 定期测试游戏功能
   - 监控响应时间和成功率
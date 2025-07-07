# Pollinations.ai 配置指南

## 概述

Pollinations.ai 是一个免费的 AI 文本生成服务，支持多种模型（OpenAI、Mistral、Claude 等）。本指南将帮助你正确配置 Pollinations.ai 作为游戏的 AI 后端。

## 配置步骤

### 1. 环境变量设置

在 Vercel Dashboard 中设置以下环境变量：

```bash
AI_API_URL=https://text.pollinations.ai/openai
AI_DEFAULT_MODEL=openai
```

### 2. API 密钥配置（可选）

#### 选项 A：匿名访问（推荐开始使用）
```bash
AI_API_KEY=not-required
```
- **优点**：无需注册，立即可用
- **缺点**：有速率限制（约 15 秒/请求）

#### 选项 B：认证访问（推荐生产使用）
```bash
AI_API_KEY=your-pollinations-token
```
- **优点**：更高的速率限制（5-3 秒/请求或无限制）
- **缺点**：需要注册获取 token

### 3. 获取 Pollinations.ai Token（可选）

1. 访问 [https://auth.pollinations.ai](https://auth.pollinations.ai)
2. 注册账户
3. 创建应用或获取 API token
4. 将 token 设置为 `AI_API_KEY` 环境变量

## 支持的模型

- `openai` - 类似 GPT 的模型
- `mistral` - Mistral AI 模型
- `claude` - Anthropic Claude 模型

## 测试配置

### 方法 1：使用测试脚本

运行项目中的测试脚本：
```bash
node test-pollinations.js
```

### 方法 2：手动测试

```bash
# 匿名测试
curl https://text.pollinations.ai/openai \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Hello"}],
    "seed": 42
  }'

# 认证测试（如果有 token）
curl https://text.pollinations.ai/openai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Hello"}],
    "seed": 42
  }'
```

## 常见问题

### Q: 为什么游戏响应很慢？
A: 匿名访问有 15 秒的速率限制。建议获取 API token 以提高速度。

### Q: 游戏返回错误或格式不正确的响应？
A: Pollinations.ai 有时返回非 JSON 格式。我们的代码已经添加了 JSON 强制提示和错误处理。

### Q: 如何切换模型？
A: 修改 `AI_DEFAULT_MODEL` 环境变量为 `openai`、`mistral` 或 `claude`。

### Q: 可以同时使用多个 AI 服务吗？
A: 是的，你可以随时在环境变量中切换不同的 AI 服务商。

## 性能优化建议

1. **使用认证访问**：获取 API token 以减少速率限制
2. **选择合适的模型**：`openai` 通常响应最快
3. **监控使用量**：虽然免费，但仍有使用限制
4. **备用方案**：准备其他 AI 服务商作为备用

## 故障排除

如果遇到问题，请查看：
1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 详细的故障排除指南
2. Vercel 函数日志 - 查看具体错误信息
3. 浏览器控制台 - 查看前端错误

## 相关链接

- [Pollinations.ai 官网](https://pollinations.ai/)
- [Pollinations.ai API 文档](https://github.com/pollinations/pollinations/blob/master/APIDOCS.md)
- [认证注册页面](https://auth.pollinations.ai)
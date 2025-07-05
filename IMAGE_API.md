# 图片生成API文档

## 概述

本项目现在包含了一个统一的图片生成API，参考了chat.js的设计模式，从环境变量获取配置，支持多种图片生成服务。

## 功能特点

- ✅ 统一的API接口设计，与chat.js保持一致
- ✅ 从环境变量获取配置，安全可靠
- ✅ 支持多种图片生成服务（当前默认使用Pollinations）
- ✅ 完整的错误处理和超时控制
- ✅ 支持本地文件访问和服务器部署两种模式
- ✅ 可配置的图片参数（尺寸、模型、种子等）

## API端点

### POST /api/image

生成图片的主要API端点。

#### 请求参数

```json
{
  "prompt": "图片描述文本（必需）",
  "width": 800,
  "height": 600,
  "model": "flux",
  "seed": 42,
  "nologo": true,
  "enhance": false,
  "safe": false
}
```

#### 参数说明

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| prompt | string | ✅ | - | 图片描述文本 |
| width | number | ❌ | 800 | 图片宽度（像素） |
| height | number | ❌ | 600 | 图片高度（像素） |
| model | string | ❌ | flux | 生成模型（flux, turbo, gptimage等） |
| seed | number | ❌ | - | 随机种子，用于可重现的结果 |
| nologo | boolean | ❌ | false | 是否移除水印 |
| enhance | boolean | ❌ | false | 是否增强提示词 |
| safe | boolean | ❌ | false | 是否启用安全模式 |

#### 响应格式

```json
{
  "success": true,
  "imageUrl": "https://image.pollinations.ai/prompt/...",
  "model": "flux",
  "prompt": "用户输入的提示词",
  "parameters": {
    "width": "800",
    "height": "600",
    "seed": null,
    "nologo": true,
    "enhance": false,
    "safe": false
  }
}
```

## 环境变量配置

在`.env`文件中配置以下变量：

```bash
# 图片生成 API 配置
IMAGE_API_URL=https://image.pollinations.ai
IMAGE_API_KEY=
IMAGE_REFERRER=
IMAGE_DEFAULT_MODEL=flux
```

### Pollinations 访问级别和速率限制

| 级别 | 速率限制 | 认证方式 | 说明 |
|------|----------|----------|------|
| Anonymous | 15秒 | 无需认证 | 默认免费访问 |
| Seed | 5秒 | Referrer | 注册应用域名 |
| Flower | 3秒 | API Token | 申请高级访问 |
| Nectar | 无限制 | API Token | 企业级访问 |

#### 配置方式：

**1. 匿名访问（15秒限制）**
```bash
IMAGE_API_URL=https://image.pollinations.ai
IMAGE_API_KEY=
IMAGE_REFERRER=
IMAGE_DEFAULT_MODEL=flux
```

**2. Seed级别（5秒限制）**
```bash
IMAGE_API_URL=https://image.pollinations.ai
IMAGE_API_KEY=
IMAGE_REFERRER=your-registered-domain.com
IMAGE_DEFAULT_MODEL=flux
```

**3. Flower/Nectar级别（3秒/无限制）**
```bash
IMAGE_API_URL=https://image.pollinations.ai
IMAGE_API_KEY=your-pollinations-token
IMAGE_REFERRER=
IMAGE_DEFAULT_MODEL=flux
```

> 📝 **注册地址**: https://auth.pollinations.ai

### 支持的服务商

#### 1. Pollinations（推荐）
- **免费使用**，支持多种访问级别
- **无需注册**即可开始使用（匿名级别）
- **可升级**到更高访问级别获得更快速率

#### 2. DALL-E（需要OpenAI API Key）
```bash
IMAGE_API_URL=https://api.openai.com/v1/images/generations
IMAGE_API_KEY=sk-your-openai-key
IMAGE_DEFAULT_MODEL=dall-e-3
```

#### 3. Midjourney（需要相应的API Key）
```bash
IMAGE_API_URL=https://api.midjourney.com/v1
IMAGE_API_KEY=your-midjourney-key
IMAGE_DEFAULT_MODEL=midjourney
```

## 前端集成

### 修改后的generateImage函数

前端的`generateImage`函数已经更新，现在会：

1. **服务器模式**：通过`/api/image`端点调用后端API
2. **本地文件模式**：直接调用Pollinations API

```javascript
async function generateImage(prompt) {
    // 检查是否是本地文件访问
    const isLocalFile = window.location.protocol === 'file:';
    
    if (isLocalFile) {
        // 本地模式：直接调用Pollinations
        imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&width=800&height=600&model=flux`;
    } else {
        // 服务器模式：通过后端API
        const response = await fetch('/api/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: prompt,
                width: 800,
                height: 600,
                nologo: true,
                model: 'flux'
            })
        });
        
        const data = await response.json();
        imageUrl = data.imageUrl;
    }
}
```

## 测试

### 1. 使用测试页面

访问`test-image.html`来测试图片生成功能：

```bash
# 如果使用本地服务器
http://localhost:3000/test-image.html

# 或者直接打开文件
file:///path/to/your/project/test-image.html
```

### 2. 使用cURL测试

```bash
curl -X POST http://localhost:3000/api/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful Chinese landscape with mountains and rivers",
    "width": 800,
    "height": 600,
    "model": "flux",
    "nologo": true
  }'
```

### 3. 使用JavaScript测试

```javascript
fetch('/api/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        prompt: 'A serene mountain landscape at sunset',
        width: 1024,
        height: 768,
        model: 'flux'
    })
})
.then(response => response.json())
.then(data => {
    console.log('生成成功:', data);
    // 使用 data.imageUrl 显示图片
})
.catch(error => {
    console.error('生成失败:', error);
});
```

## 错误处理

API包含完整的错误处理：

- **400**: 缺少必需参数（如prompt）
- **405**: 不支持的HTTP方法
- **500**: 服务器内部错误或图片生成失败
- **超时**: 60秒超时保护

## 性能优化

- ✅ 60秒超时控制，避免长时间等待
- ✅ 图片预加载验证
- ✅ 备用图片机制
- ✅ 详细的日志记录
- ✅ 优雅的错误降级

## 扩展性

该API设计具有良好的扩展性：

1. **多服务商支持**：通过环境变量轻松切换不同的图片生成服务
2. **参数可配置**：支持各种图片生成参数
3. **统一接口**：无论后端使用哪种服务，前端调用方式保持一致
4. **向后兼容**：保持与现有代码的兼容性

## 注意事项

1. **Pollinations速率限制**：
   - 匿名访问：15秒间隔
   - Seed级别：5秒间隔
   - Flower级别：3秒间隔
   - Nectar级别：无限制
2. **认证升级**：访问 https://auth.pollinations.ai 注册获得更快访问速度
3. **本地文件访问**：会直接调用Pollinations API，绕过后端
4. **CORS问题**：图片设置了`crossOrigin='anonymous'`属性
5. **环境变量**：确保在生产环境中正确配置环境变量
6. **Logo显示**：免费用户生成的图片可能包含Pollinations logo，注册用户可通过`nologo=true`移除

## 更新日志

- **v1.1**: 添加Pollinations认证支持
  - 支持API Token和Referrer两种认证方式
  - 更新速率限制说明
  - 添加访问级别配置指南
- **v1.0**: 初始版本，支持Pollinations API
  - 参考chat.js的设计模式
  - 统一的环境变量配置
  - 完整的错误处理和测试页面
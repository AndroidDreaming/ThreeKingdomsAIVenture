export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 从环境变量获取API配置（安全）
    const apiUrl = process.env.AI_API_URL || 'https://chatapi.akash.network/api/v1';
    const apiKey = process.env.AI_API_KEY;
    const defaultModel = process.env.AI_DEFAULT_MODEL || 'DeepSeek-R1-0528';

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // 使用传入的模型或默认模型（空字符串也使用默认模型）
    const selectedModel = (model && model.trim()) || defaultModel;

    const finalApiUrl = apiUrl.trim() + '/chat/completions';

    // 创建带超时的fetch请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000); // 50秒超时

    try {
      const response = await fetch(finalApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: "json_object" },
          max_tokens: 4000, // 增加响应长度限制
          temperature: 0.7,
          stream: false // 确保不使用流式响应
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // 返回AI响应
      res.status(200).json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout - AI API took too long to respond');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
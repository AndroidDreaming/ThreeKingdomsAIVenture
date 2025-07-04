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

    // 使用传入的模型或默认模型
    const selectedModel = model || defaultModel;

    const finalApiUrl = apiUrl.trim() + '/chat/completions';

    const response = await fetch(finalApiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // 返回AI响应
    res.status(200).json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
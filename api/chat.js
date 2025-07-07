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

    let finalApiUrl = apiUrl.trim() + '/chat/completions';

    if(apiUrl.includes('pollinations.ai')){
      finalApiUrl = apiUrl.trim();
    }

    // 创建带超时的fetch请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000); // 50秒超时

    try {
      // 根据不同的API提供商构建请求
      let requestBody, headers;
      
      if (apiUrl.includes('pollinations.ai')) {
        // Pollinations.ai 格式
        headers = {
          'Content-Type': 'application/json'
        };
        
        // 如果有 API key，添加 Authorization header
        if (apiKey && apiKey !== 'not-required') {
          headers['Authorization'] = `Bearer ${apiKey}`;
        }
        
        // 构建消息，添加强制 JSON 输出的系统提示
        const messages = [
          {
            role: 'system',
            content: 'You must respond with valid JSON format only. Do not include any text outside the JSON structure.'
          },
          { role: 'user', content: prompt }
        ];
        
        requestBody = {
          model: selectedModel || 'openai',
          messages: messages,
          seed: Math.floor(Math.random() * 1000)
        };
      } else {
        // 标准 OpenAI 格式
        headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        };
        requestBody = {
          model: selectedModel,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: "json_object" },
          max_tokens: 4000,
          temperature: 0.7,
          stream: false
        };
      }

      const response = await fetch(finalApiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
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
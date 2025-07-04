export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 从环境变量获取API配置
    const apiUrl = process.env.AI_API_URL || 'https://chatapi.akash.network/api/v1';
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const modelsUrl = `${apiUrl}/models`;

    const response = await fetch(modelsUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    
    // 返回模型列表
    res.status(200).json(data);

  } catch (error) {
    console.error('Models API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch models', 
      message: error.message 
    });
  }
}
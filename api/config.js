export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 返回当前的默认配置（不包含敏感信息）
    const config = {
      defaultModel: process.env.AI_DEFAULT_MODEL || 'DeepSeek-R1-0528',
      apiUrl: process.env.AI_API_URL || 'https://chatapi.akash.network/api/v1',
      hasApiKey: !!process.env.AI_API_KEY
    };
    
    res.status(200).json(config);

  } catch (error) {
    console.error('Config API error:', error);
    res.status(500).json({ 
      error: 'Failed to get config', 
      message: error.message 
    });
  }
}
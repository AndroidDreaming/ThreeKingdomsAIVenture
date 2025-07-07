// 测试 Pollinations.ai API 的脚本
const testPollinationsAPI = async (apiKey = null) => {
  const url = 'https://text.pollinations.ai/openai';
  
  const payload = {
    model: 'openai',
    messages: [
      { role: 'system', content: 'You must respond with valid JSON format only. Do not include any text outside the JSON structure.' },
      { role: 'user', content: 'Hello, how are you? Please respond in JSON format with a "message" field.' }
    ],
    seed: 42
  };

  const headers = {
    'Content-Type': 'application/json'
  };

  // 如果提供了 API key，添加 Authorization header
  if (apiKey && apiKey !== 'not-required') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  try {
    console.log('正在测试 Pollinations.ai API...');
    console.log('请求 URL:', url);
    console.log('请求头:', JSON.stringify(headers, null, 2));
    console.log('请求数据:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 错误:', errorText);
      return;
    }

    const data = await response.json();
    console.log('API 响应:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('AI 回复:', data.choices[0].message.content);
    }

  } catch (error) {
    console.error('请求失败:', error.message);
  }
};

// 如果直接运行此文件
if (typeof window === 'undefined') {
  // Node.js 环境
  const fetch = require('node-fetch');
  testPollinationsAPI();
} else {
  // 浏览器环境
  window.testPollinationsAPI = testPollinationsAPI;
}
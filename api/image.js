export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, width, height, model, seed, nologo, enhance, safe } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 从环境变量获取图片API配置
    const imageApiUrl = process.env.IMAGE_API_URL || 'https://image.pollinations.ai';
    const imageApiKey = process.env.IMAGE_API_KEY; // Pollinations API Token (可选)
    const imageReferrer = process.env.IMAGE_REFERRER; // Pollinations Referrer (可选)
    const defaultModel = process.env.IMAGE_DEFAULT_MODEL || 'flux';

    // 使用传入的模型或默认模型
    const selectedModel = (model && model.trim()) || defaultModel;

    // 构建图片生成URL
    const baseUrl = `${imageApiUrl.trim()}/prompt/${encodeURIComponent(prompt)}`;
    
    // 构建查询参数
    const params = new URLSearchParams();
    
    // 设置默认参数
    params.append('model', selectedModel);
    params.append('width', width || '800');
    params.append('height', height || '600');
    
    // 可选参数
    if (seed) params.append('seed', seed);
    if (nologo === true || nologo === 'true') params.append('nologo', 'true');
    if (enhance === true || enhance === 'true') params.append('enhance', 'true');
    if (safe === true || safe === 'true') params.append('safe', 'true');
    
    // Pollinations认证支持
    const headers = {};
    if (imageApiKey) {
      // 使用API Token认证
      headers['Authorization'] = `Bearer ${imageApiKey}`;
    }
    if (imageReferrer) {
      // 使用Referrer认证
      headers['Referer'] = imageReferrer;
      params.append('referrer', imageReferrer);
    }

    const finalUrl = `${baseUrl}?${params.toString()}`;

    // 创建带超时的fetch请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时，图片生成需要更长时间

    try {
      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Image API Error ${response.status}:`, errorText);
        throw new Error(`Image generation failed: ${response.status} ${errorText}`);
      }

      // 检查响应是否为图片
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Invalid response: Expected image data');
      }

      // 获取图片数据
      const imageBuffer = await response.arrayBuffer();
      
      // 返回图片生成结果
      res.status(200).json({
        success: true,
        imageUrl: finalUrl,
        model: selectedModel,
        prompt: prompt,
        parameters: {
          width: width || '800',
          height: height || '600',
          seed: seed || null,
          nologo: nologo || false,
          enhance: enhance || false,
          safe: safe || false
        }
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout - Image generation took too long');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('Image API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
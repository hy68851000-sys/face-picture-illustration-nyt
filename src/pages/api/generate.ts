import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: '缺少图片数据' });
  }

  try {
    // 将 base64 转换为 data URL
    const imageDataUrl = `data:image/png;base64,${image}`;

    const response = await fetch('https://api.siliconflow.cn/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "Qwen-Image-Edit",
        image_url: imageDataUrl,
        prompt: "Transform this portrait into a classic New York Times editorial illustration style: black and white pen and ink drawing, cross-hatching technique, woodcut aesthetic, high contrast, newspaper editorial art, vintage engraving style, detailed line work, professional portrait illustration",
        negative_prompt: "color, photograph, realistic, modern, digital art, painting",
        image_size: "1024x1024",
        batch_size: 1,
        seed: Math.floor(Math.random() * 1000000),
        guidance_scale: 7.5,
        num_inference_steps: 20
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SiliconFlow API error:', errorData);
      return res.status(response.status).json({ 
        error: `API 错误: ${errorData.message || response.statusText}` 
      });
    }

    const data = await response.json();
    
    if (!data.images || !data.images[0] || !data.images[0].url) {
      console.error('Invalid API response:', data);
      return res.status(500).json({ error: 'API 返回数据格式错误' });
    }

    res.status(200).json({ result: data.images[0].url });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ error: '生成失败，请稍后重试' });
  }
}

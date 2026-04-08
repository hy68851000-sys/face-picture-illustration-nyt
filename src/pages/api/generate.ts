import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body; // base64 string

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/image/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "flux-1-schnell", // 示例模型
        prompt: "NYT editorial illustration style, black and white, pen sketch, newspaper portrait",
        image: image,
        image_strength: 0.7
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.images[0].url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate illustration' });
  }
}

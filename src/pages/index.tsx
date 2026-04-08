import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image.split(',')[1] }), // 发送 Base64 内容
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        alert('生成失败: ' + (data.error || '未知错误'));
      }
    } catch (err) {
      alert('请求出错，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-gray-900 font-serif">
      <Head>
        <title>NYT-Style Illustrator</title>
      </Head>

      <header className="border-b border-gray-200 py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">NYT-Style Illustrator</h1>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <p className="text-xl text-gray-600">将您的面孔转化为经典版画艺术</p>
        </section>

        <section className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-8 bg-gray-50 hover:bg-gray-100 transition">
          <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" accept="image/*" />
          <label htmlFor="fileInput" className="cursor-pointer">
            {image ? (
              <img src={image} alt="Preview" className="max-h-64 mx-auto" />
            ) : (
              <p className="text-gray-500">拖拽或点击上传照片 (JPG/PNG/WEBP)</p>
            )}
          </label>
        </section>

        <div className="text-center mb-12">
          <button 
            onClick={handleGenerate}
            disabled={!image || loading}
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 disabled:bg-gray-300 transition"
          >
            {loading ? 'AI 正在绘制中...' : '生成插画'}
          </button>
        </div>

        {result && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-gray-200 p-4">
              <h3 className="font-bold mb-2">原图</h3>
              <img src={image!} alt="Original" />
            </div>
            <div className="border border-gray-200 p-4">
              <h3 className="font-bold mb-2">生成效果</h3>
              <img src={result} alt="Result" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

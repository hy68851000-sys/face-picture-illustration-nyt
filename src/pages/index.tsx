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
        body: JSON.stringify({ image: image.split(',')[1] }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
      } else {
        alert('生成失败: ' + (data.error || '未知错误'));
      }
    } catch {
      alert('请求出错，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = `nyt-illustration-${Date.now()}.png`;
    a.click();
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
        <section className="text-center mb-8">
          <p className="text-xl text-gray-600">将您的面孔转化为经典版画艺术</p>
          <p className="text-sm text-gray-400 mt-2">请确保图片中有清晰的人脸，正面效果最佳</p>
        </section>

        <section className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-8 bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
          <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" accept="image/jpeg,image/png,image/webp" />
          <label htmlFor="fileInput" className="cursor-pointer block">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="Preview" className="max-h-64 mx-auto" />
            ) : (
              <div>
                <p className="text-gray-500 text-lg">拖拽或点击上传照片</p>
                <p className="text-gray-400 text-sm mt-1">支持 JPG / PNG / WEBP，最大 10MB</p>
              </div>
            )}
          </label>
        </section>

        <div className="text-center mb-12">
          <button
            onClick={handleGenerate}
            disabled={!image || loading}
            className="bg-black text-white px-10 py-3 rounded hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-lg"
          >
            {loading ? 'AI 正在绘制中...' : '生成插画'}
          </button>
        </div>

        {result && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="border border-gray-200 p-4 rounded">
                <h3 className="font-bold mb-2 text-center">原图</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image!} alt="Original" className="w-full" />
              </div>
              <div className="border border-gray-200 p-4 rounded">
                <h3 className="font-bold mb-2 text-center">生成效果</h3>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="Result" className="w-full" />
              </div>
            </section>
            <div className="text-center">
              <button
                onClick={handleDownload}
                className="bg-gray-800 text-white px-8 py-3 rounded hover:bg-black transition"
              >
                下载作品
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-gray-400 text-sm py-8 border-t border-gray-100">
        无需登录 · 图片不落地存储 · © 2026 NYT-Style Illustrator
      </footer>
    </div>
  );
}

face-picture-illustration-nyt MVP 需求文档 v1.0
face-picture-illustration-nyt MVP 需求文档
版本： v1.0
日期： 2026-04-07
域名： face-picture-illustration-nyt.online
阶段： MVP（一期）

一、产品定位
一个将人脸照片转换为《纽约时报》风格黑白素描插画的在线工具。用户上传照片，AI 一键生成，即时下载。无需注册，无需登录，开箱即用。

二、核心功能（一期必做）
1. 图片上传
支持拖拽上传 + 点击选择两种方式
支持格式：JPG / PNG / WEBP
文件大小限制：≤ 10MB
上传后立即在左侧预览原图
2. 人脸检测提示
上传后给出图片质量引导提示
提示文案：「请确保图片中有清晰的人脸，正面效果最佳」
若图片尺寸过小（< 256px）给出警告提示
3. 一键生成
单个「生成插画」按钮，点击后调用 AI 接口
生成中显示 loading 状态（进度动画）
AI 服务：硅基流动（SiliconFlow）Flux / SDXL 图生图
Prompt 方向：NYT editorial illustration style, black and white, pen sketch, newspaper portrait
4. 结果预览（对比视图）
左：原图
右：生成的插画效果图
支持左右滑动对比（slider 组件）或并排展示
5. 下载按钮
下载生成的插画图片
文件名格式：nyt-illustration-{timestamp}.png

三、技术栈

层级 | 技术选型
--- | ---
前端框架 | Next.js 15 + TypeScript
样式 | Tailwind CSS v4
托管 | Cloudflare Pages（@opennextjs/cloudflare）
AI 服务 | 硅基流动 SiliconFlow — Flux / SDXL 图生图
图片处理 | 纯前端 base64 传输，不落地存储

四、页面结构
首页（单页应用）
├── Header：Logo + 域名品牌
├── Hero 区：标题 + 简短说明
├── 上传区：拖拽框 + 点击上传
├── 操作区：生成按钮 + 状态提示
├── 预览区：原图 vs 效果图对比
├── 下载区：下载按钮
└── Footer：简单版权信息

五、API 设计
POST /api/generate
请求体：
{
  "image": "base64字符串",
  "mimeType": "image/jpeg"
}
响应：
{
  "result": "base64字符串",
  "format": "png"
}
后端调用硅基流动图生图接口，API Key 存放在 Cloudflare 环境变量 SILICONFLOW_API_KEY。

六、非功能要求
移动端响应式适配
生成超时时间：60 秒
无需登录，无需账号
无数据落地（图片不存服务器）

七、不做（二期再说）
用户登录 / 账号系统
历史记录
风格选择（多种插画风格）
批量处理
商业化 / 付费墙

八、验收标准
可以成功上传图片
人脸提示正常显示
点击生成后返回插画结果
对比预览正常展示
下载功能可用
移动端布局不错位
部署到 face-picture-illustration-nyt.online 可访问

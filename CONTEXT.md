# 完整项目历史与上下文

## 项目起源与目标

### 用户需求（原始）
用户有一个包含 108 个思维模型的 PDF 文件《思维模型图解 108 个.pdf》，想要：
1. 将 PDF 中的每个模型页面提取出来
2. 创建一个移动端友好的 Web 应用来学习这些模型
3. **关键需求**：保持 PDF 原始的视觉结构和逻辑关系（连线、框图等）

### 为什么选择截图方案
用户明确说：
> "你是人工智能啊，我做起来要花好长时间。我之前使用人工智能可以做的，你就想办法一页一页的转成 JPG, PNG 之类的，然后显示。"

> "还是不行，依然是全黑的。我建议你一个一个截图吧，这样简单又可靠。"

**核心洞察**：PDF 提取文字会失去原有的视觉结构（连线、框图、层次关系），截图是最简单可靠的方式。

---

## 技术探索历史（重要 - 避免重复踩坑）

### ❌ 失败的方案

1. **Node.js canvas 渲染**
   - 尝试：`render_pdf.mjs`, `convert-with-jsdom.mjs`
   - 问题：canvas 包需要 Python/node-gyp 编译
   - 错误：`Could not find any Python installation to use`
   - 结论：Windows 环境没有 Python 时不可行

2. **pdf.js + jsdom**
   - 尝试：`convert-with-jsdom.mjs`
   - 问题：jsdom 的 canvas 没有 2D 上下文
   - 错误：`HTMLCanvasElement's getContext() method: without installing the canvas npm package`
   - 结论：纯 Node.js 方案需要 canvas 包

3. **browser canvas 黑屏问题**
   - 尝试：多个版本的 pdf.js
   - 问题：worker 版本不匹配、API 版本不匹配
   - 错误：`The API version 5.6.205 does not match the Worker version 3.11.174`
   - 结论：pdf.js 版本必须严格匹配

### ✅ 成功的方案

**浏览器端转换**：
- 使用 pdf.js 2.16.105（稳定版本，CDN 可用）
- JSZip 打包下载
- 文件名 URL 编码解决中文问题
- 文件：`public/convert-pdf-auto.html`

**关键点**：
```javascript
// PDF 文件名必须 URL 编码
const PDF_FILE = './%E6%80%9D%E7%BB%B4%E6%A8%A1%E5%9E%8B%E5%9B%BE%E8%A7%A3108%E4%B8%AA.pdf'

// pdf.js 使用全局变量方式（避免 ES 模块问题）
const pdfjsLib = window['pdfjs-dist/build/pdf']
pdfjsLib.GlobalWorkerOptions.workerSrc = '.../pdf.worker.min.js'
```

---

## 架构决策

### 为什么不用文字提取
1. PDF 提取的文字是纯文本，失去了原有的视觉层次
2. 连线、框图、颜色编码等关键信息丢失
3. 文字顺序可能混乱（PDF 是多栏布局）
4. 用户明确要求"截图"方式

### 为什么用图片而非 Canvas 实时渲染
1. 图片加载更快、更可靠
2. 不需要在移动端实时渲染 PDF（性能开销大）
3. 图片可以缓存、预加载
4. 用户可以随时缩放查看细节

### 为什么缩放默认是 55%
- PDF 原图尺寸较大（约 1000x1400px）
- 手机屏幕宽度有限（约 360-414px）
- 55% 是在"看清内容"和"减少滚动"之间的平衡点

---

## 文件结构决策

```
mental-model-app/
├── public/
│   ├── pages/              # PDF 转换的 PNG 图片（108 张）
│   ├── mental_models.json  # 模型元数据
│   ├── 思维模型图解 108 个.pdf  # 原始 PDF
│   ├── convert-pdf-auto.html  # 转换工具
│   └── jszip.min.js        # 本地 JSZip（避免 CDN 被拦截）
├── src/
│   ├── components/
│   │   ├── PdfImageViewer.vue  # PDF 图片查看器（带缩放）
│   │   ├── ShareModal.vue      # 分享弹窗
│   │   └── ...
│   ├── views/
│   │   ├── ModelDetail.vue     # 模型详情页
│   │   └── ...
│   └── stores/
│       └── model.js            # 模型数据管理
```

---

## 组件设计思路

### PdfImageViewer.vue
**职责**：显示单个 PDF 页面的图片，支持缩放

**设计原则**：
- 图片优先加载，失败时不阻塞
- 缩放不影响页面滚动（移除了 wheel 事件）
- 容器宽度随缩放变化（避免空白）
- 状态简单：loading → loaded / error

**关键代码**：
```javascript
const scale = ref(0.55)
const containerWidth = computed(() => (scale.value / 0.55) * 100)
```

### ModelDetail.vue
**布局**（从上到下）：
1. 导航栏（返回 + 分享）
2. PDF 图片区域（可缩放）
3. 模型头部（名称、描述、模块标签、收藏按钮）
4. 底部操作栏（标记已学 + 开始测试）
5. 相关推荐（可选）

**为什么移除了 ContentVisualizer**：
- 显示的文字内容是 PDF 提取的，格式混乱
- 用户没有要求文字内容，只需要图片展示

---

## 数据结构

### mental_models.json
```json
{
  "models": [
    {
      "id": 1,
      "name": "英雄之旅",
      "page": 1,           // 对应 PDF 页码/图片页码
      "module": "认知模块",  // 模块分类
      "description": "..."  // 一句话描述
    }
  ]
}
```

### 模块分类
- 认知模块 (绿色 #07c160)
- 决策模块 (紫色 #667eea)
- 组织模块 (橙色 #ff976a)
- 创新模块 (蓝色 #1890ff)
- 战略模块 (深紫 #722ed1)
- 其他 (灰色 #969799)

---

## 已知 Bug 修复历史

1. **PDF 文件 404** → 文件名 URL 编码
2. **pdf.js 404** → 换用 2.16.105 版本（.js 而非.mjs）
3. **JSZip 被拦截** → 下载到本地 `public/jszip.min.js`
4. **图片不显示** → 修复 loading 状态逻辑（v-if 条件问题）
5. **滚变缩放** → 移除 wheel 事件，只用按钮
6. **容器空白** → 容器宽度随缩放变化

---

## 用户偏好记录

1. ✅ 喜欢简洁的解决方案（"简单又可靠"）
2. ✅ 重视视觉效果（保持 PDF 原貌）
3. ✅ 希望自动化（"你是人工智能，我做起来要花好长时间"）
4. ✅ 实用主义（功能可用优先）

---

## 未来扩展点

如果需要添加功能，建议的顺序：

1. **图片预加载** - 提升切换体验
2. **缩放记忆** - localStorage 保存用户偏好
3. **手势支持** - 双击放大、捏合缩放
4. **离线缓存** - Service Worker 缓存图片
5. **搜索功能** - 按名称/模块搜索模型
6. **学习统计** - 可视化学习进度

---

## 命令快速参考

```bash
# 启动开发服务器
cd mental-model-app
npm run dev

# 访问地址
http://localhost:3004

# PDF 转换工具
http://localhost:3004/convert-pdf-auto.html

# 图片测试
http://localhost:3004/pages/page-001.png
```

---

## 关键配置

### package.json 依赖
```json
{
  "dependencies": {
    "pdfjs-dist": "^5.6.205",  // 实际使用 2.16.105（CDN）
    "pinia": "^3.0.4",
    "vant": "^4.9.24",
    "vue": "^3.5.30",
    "vue-router": "^5.0.4"
  }
}
```

### Vite 配置
默认配置，无特殊设置。

---

最后更新：2026-04-04
状态：图片显示 + 缩放功能完成

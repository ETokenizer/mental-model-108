# PDF 转图片说明

## 方法一：浏览器自动转换（推荐）

1. 确保 dev server 正在运行：`npm run dev`
2. 打开浏览器访问：http://localhost:3004/convert-pdf-auto.html
3. 页面会自动：
   - 加载 PDF 文件
   - 将 108 页转换为 PNG 图片
   - 自动打包下载为 `思维模型 108 页.zip`
4. 解压 zip 文件，将所有图片复制到 `public/pages/` 目录

## 方法二：手动转换单页

如果不能自动下载，可以使用以下方法：

1. 打开：http://localhost:3004/convert-pdf.html
2. 点击"开始转换"按钮
3. 等待转换完成
4. 点击"打包下载"按钮下载所有图片

## 转换后

转换后的图片文件名为：`page-001.png`, `page-002.png`, ..., `page-108.png`

这些图片会自动被 `PdfImageViewer.vue` 组件加载显示。

## 注意事项

- 转换过程可能需要 2-5 分钟
- 确保浏览器允许弹窗（用于下载）
- 转换后的图片总计约 50-100MB

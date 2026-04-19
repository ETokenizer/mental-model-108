import puppeteer from 'puppeteer'
import { mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outputDir = join(__dirname, 'public/pages')
const screenshotDir = join(__dirname, 'public/screenshots')
const thumbnailDir = join(__dirname, 'public/thumbnails')

// Create output directories
[outputDir, screenshotDir, thumbnailDir].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
    console.log('Created directory:', dir)
  }
})

async function convertPdfToImages() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    const pdfPath = join(__dirname, 'public/思维模型图解 108 个.pdf')

    // Navigate to PDF
    await page.goto(`file:///${pdfPath}`)
    await page.waitForTimeout(2000)

    // Get number of pages using pdf.js
    const numPages = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const checkPdf = setInterval(() => {
          const embed = document.querySelector('embed')
          if (embed && embed.getViewer) {
            clearInterval(checkPdf)
            resolve(embed.getViewer().pdfViewer.pagesCount)
          }
        }, 100)
        setTimeout(() => {
          clearInterval(checkPdf)
          resolve(108) // fallback
        }, 5000)
      })
    })

    console.log(`PDF has ${numPages} pages`)

    // Screenshot each page
    for (let i = 1; i <= numPages; i++) {
      console.log(`Processing page ${i}/${numPages}...`)

      // Navigate to specific page
      await page.goto(`file:///${pdfPath}#page=${i}`)
      await page.waitForTimeout(500)

      // Take full page screenshot first
      const tempPath = join(outputDir, `temp-${i}.png`)
      await page.screenshot({
        path: tempPath,
        fullPage: true,
        type: 'png'
      })

      // Read the image and detect green border
      const imageBuffer = await sharp(tempPath).toBuffer()
      const metadata = await sharp(imageBuffer).metadata()

      // Detect green border bounds
      const bounds = await detectGreenBorder(imageBuffer)

      if (bounds) {
        // Crop to green border content
        const croppedBuffer = await sharp(imageBuffer)
          .extract({
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height
          })
          .toBuffer()

        // Save full size screenshot (cropped)
        const screenshotPath = join(screenshotDir, `screenshot-${String(i).padStart(3, '0')}.png`)
        await sharp(croppedBuffer).toFile(screenshotPath)
        console.log(`Saved screenshot: ${screenshotPath}`)

        // Save thumbnail (80x80)
        const thumbnailPath = join(thumbnailDir, `thumb-${String(i).padStart(3, '0')}.png`)
        await sharp(croppedBuffer)
          .resize(80, 80, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .toFile(thumbnailPath)
        console.log(`Saved thumbnail: ${thumbnailPath}`)
      } else {
        console.log(`No green border detected for page ${i}, saving original`)
        // If no green border detected, save original
        const screenshotPath = join(screenshotDir, `screenshot-${String(i).padStart(3, '0')}.png`)
        await sharp(imageBuffer).toFile(screenshotPath)

        // Save thumbnail from original
        const thumbnailPath = join(thumbnailDir, `thumb-${String(i).padStart(3, '0')}.png`)
        await sharp(imageBuffer)
          .resize(80, 80, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 1 }
          })
          .toFile(thumbnailPath)
      }

      // Remove temp file
      import('fs').then(({ unlinkSync }) => unlinkSync(tempPath))
    }

    console.log('Done! All pages converted.')
  } catch (err) {
    console.error('Error:', err.message)
    console.error(err.stack)
  } finally {
    await browser.close()
  }
}

// Detect green border and return crop bounds
async function detectGreenBorder(buffer) {
  const image = sharp(buffer)
  const { width, height } = await image.metadata()
  const rawPixels = await image.raw().toBuffer()

  // Green color threshold (adjust as needed)
  const greenThreshold = 150

  // Find bounds by scanning for green pixels
  let minX = width, maxX = 0, minY = height, maxY = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const r = rawPixels[idx]
      const g = rawPixels[idx + 1]
      const b = rawPixels[idx + 2]

      // Check if pixel is green (green dominant)
      if (g > greenThreshold && g > r && g > b) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  // If green border found, return inner content bounds
  if (maxX > minX && maxY > minY) {
    // Add small padding to ensure we capture content just inside the border
    const padding = 5
    return {
      left: Math.max(0, minX - padding),
      top: Math.max(0, minY - padding),
      width: Math.min(width - minX + padding * 2, maxX - minX + padding * 2),
      height: Math.min(height - minY + padding * 2, maxY - minY + padding * 2)
    }
  }

  return null
}

convertPdfToImages()

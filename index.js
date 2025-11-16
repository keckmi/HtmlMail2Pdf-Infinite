//npm install playwright
//npx playwright install 
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function run() {
    if (process.argv.length < 3) {
        console.error("Usage: node index.js <input.html>");
        process.exit(1);
    }

    const input = process.argv[2];
    if (!fs.existsSync(input)) {
        console.error("File not found:", input);
        process.exit(1);
    }

    const absInput = path.resolve(input);
    const output = absInput.replace(/\.html?$/i, "") + ".pdf";

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Load HTML
    await page.goto("file://" + absInput, { waitUntil: "networkidle" });

    // Force screen media
    await page.emulateMedia({ media: "screen" });

    // Get full page height
    const bodyHandle = await page.$("body");
    const boundingBox = await bodyHandle.boundingBox();
    const height = await page.evaluate(() => {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
    });

    // Generate PDF with exact height
    await page.pdf({
        path: output,
        printBackground: true,
        width: "210mm",       // standard A4 width, can adjust
        height: `${height}px`, // full content height
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();
    console.log("PDF created:", output);
}

run();
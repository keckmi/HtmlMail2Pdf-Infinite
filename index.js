//npm install playwright
//npm install cheerio //for mailMeta.js
//npx playwright install 
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { extractMailMeta } = require("./mailMeta");

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

    // ⬇️ READ HTML and extract metadata via mailMeta.js
    const html = fs.readFileSync(input, "utf8");
    const { sender, formattedDate } = extractMailMeta(html);

    const dir = path.dirname(input);
    const baseName = path.basename(input, ".html");

    // ⬇️ BUILD NEW FILENAME
    const newBaseName = `${formattedDate}_${sender}_${baseName}`;
    const output = path.join(dir, newBaseName + ".pdf");

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto("file://" + path.resolve(input), {
        waitUntil: "networkidle",
    });

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
// mailMeta.js
const cheerio = require("cheerio");

/**
 * Extracts sender + date from WEB.DE print HTML
 */
function extractMailMeta(html) {
  const $ = cheerio.load(html);

  let senderText = "";
  let dateText = "";

  $("dt").each((_, dt) => {
    const label = $(dt).text().trim();
    const value = $(dt).next("dd").text().trim();

    if (label === "Von:") {
      senderText = value;
    }

    if (label === "Datum:") {
      dateText = value;
    }
  });

  return {
    sender: normalizeSender(senderText),
    formattedDate: formatDate(dateText),
  };
}

/**
 * Supports:
 *  - "Amazon.de" <mail@amazon.de>
 *  - kundenservice@example.de
 */
function normalizeSender(text) {
  if (!text) return "UnknownSender";

  // OLD form: "Name" <email>
  const namedMatch = text.match(/"?([^"<]+)"?\s*<[^>]+>/);
  if (namedMatch) {
    return sanitize(namedMatch[1]);
  }

  // NEW form: plain email
  const emailMatch = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  if (emailMatch) {
    return sanitize(emailMatch[0]);
  }

  return sanitize(text);
}

/**
 * '22.11.2025 18:35:01' → '2025.11.22'
 */
function formatDate(dateText) {
  const match = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return "0000.00.00";

  const [, day, month, year] = match;
  return `${year}.${month}.${day}`;
}


function sanitize(text) {
  return text
    .replace(/@/g, "(at)")
    .replace(/[<>"]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w().-]/g, "");
}

module.exports = { extractMailMeta };
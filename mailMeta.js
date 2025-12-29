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
    sender: extractSenderName(senderText),
    formattedDate: formatDate(dateText),
  };
}

/**
 * '"Amazon.de" <mail@amazon.de>' → 'Amazon.de'
 */
function extractSenderName(senderText) {
  const match = senderText.match(/"([^"]+)"/);
  return match ? match[1].trim() : "UnknownSender";
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

module.exports = { extractMailMeta };
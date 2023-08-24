const { crawlPage } = require("./crawl.js");
const { printReport } = require("./report.js");

if (process.argv.length < 3) {
    console.log("Provide a URL to begin the crawl.");
    return;
}

if (process.argv.length > 3) {
    console.log("Provide a single URL to begin the crawl.");
    return;
}

const baseURL = process.argv[2];

async function main(baseURL) {
    console.log(`Starting crawl at ${baseURL}.`);
    const pages = await crawlPage(baseURL, baseURL, {});
    printReport(pages);
}

main(baseURL);

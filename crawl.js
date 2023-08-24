const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
    if (!areDomainsEq(baseURL, currentURL)) {
        return pages;
    }

    const baseNormalized = normalizeURL(baseURL);
    const curNormalized = normalizeURL(currentURL);

    if (pages[curNormalized] !== undefined) {
        pages[curNormalized] += 1;
        return pages;
    }

    pages[curNormalized] = 1;

    if (baseNormalized === curNormalized) {
        pages[baseNormalized] = 0;
    }

    console.log(`Crawling ${currentURL}...`);

    const { htmlBody, error } = await getHTMLBody(currentURL);

    if (error !== null) {
        console.log(error.toString());
        return pages;
    }

    const urls = getURLsFromHTML(htmlBody, baseURL);

    for (let i = 0; i < urls.length; i++) {
        await crawlPage(baseURL, urls[i], pages);
    }

    return pages;
}

function areDomainsEq(url1, url2) {
    return new URL(url1).hostname === new URL(url2).hostname;
}

async function getHTMLBody(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const error = new Error(
                `Fetching webpage failed with ${response.status} status.`
            );

            return { htmlBody: null, error: error };
        }

        if (!response.headers.get("Content-Type").startsWith("text/html")) {
            const error = new Error(
                `Content type of ${url} is not 'text/html'`
            );

            return { htmlBody: null, error: error };
        }

        const htmlBody = await response.text();

        return { htmlBody: htmlBody, error: null };
    } catch (error) {
        return { htmlBody: null, error: error };
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    let urls = [];
    const dom = new JSDOM(htmlBody, { url: baseURL });
    const anchors = dom.window.document.querySelectorAll("a");

    for (var i = 0; i < anchors.length; i++) {
        urls.push(anchors[i].href);
    }

    return urls;
}

function normalizeURL(url) {
    url = new URL(url);

    if (url.pathname.endsWith("/")) {
        url.pathname = url.pathname.slice(0, -1);
    }

    return url.hostname + url.pathname;
}

module.exports = {
    crawlPage,
    areDomainsEq,
    getURLsFromHTML,
    normalizeURL,
};

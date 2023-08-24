const { areDomainsEq, getURLsFromHTML, normalizeURL } = require("./crawl.js");
const { sortPages } = require("./report.js");

const htmlBody = `
<html>
    <body>
        <p>
            <a href="https://blog.boot.dev/path1/">link1</a>
            <a href="/path2/">link2</a>
        </p>
    </body>
</html>
`;

const pages = {
    page4: 8,
    page3: 10,
    page2: 8,
    page1: 10,
};

test("domains equal", () => {
    expect(
        areDomainsEq("https://blog.boot.dev", "https://blog.boot.dev/path/")
    ).toBe(true);
});

test("domain not equal", () => {
    expect(areDomainsEq("https://blog.boog.dev", "https://boot.dev")).toBe(
        false
    );
});

test("get all links from HTML string", () => {
    expect(getURLsFromHTML(htmlBody, "https://blog.boot.dev").length).toBe(2);
});

test("relative paths converted to absolute paths", () => {
    expect(getURLsFromHTML(htmlBody, "https://blog.boot.dev")[1]).toBe(
        "https://blog.boot.dev/path2/"
    );
});

test("normalizes URL string", () => {
    expect(normalizeURL("https://blog.boot.dev/path/")).toBe(
        "blog.boot.dev/path"
    );
});

test("pages sorted by count and page", () => {
    expect(sortPages(pages)).toEqual([
        ["page1", 10],
        ["page3", 10],
        ["page2", 8],
        ["page4", 8],
    ]);
});

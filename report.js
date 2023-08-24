function printReport(pages) {
    console.log("Preparing report...");

    const sortedPages = sortPages(pages);

    for (let i = 0; i < sortedPages.length; i++) {
        const count = sortedPages[i][1];
        const url = sortedPages[i][0];
        console.log(`Found ${count} internal link(s) to ${url}`);
    }
}

function sortPages(pages) {
    return Object.entries(pages).sort((a, b) => {
        if (b[1] !== a[1]) {
            return b[1] - a[1];
        }

        return a[0].localeCompare(b[0]);
    });
}

module.exports = {
    printReport,
    sortPages,
};

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// We start with one official WB portal link
const TARGET_URLS = [
    'https://wb.gov.in/portal/government-schemes.action' 
];

async function scrape() {
    let scrapedData = [];

    for (let url of TARGET_URLS) {
        try {
            // Fetching the website data
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // This looks for scheme titles on the page
            $('.scheme-card, .list-item, h3').each((i, el) => {
                const name = $(el).text().trim();
                // Filter out short noise and duplicates
                if (name.length > 5 && name.length < 100) {
                    scrapedData.push({
                        name: name,
                        tags: autoTag(name),
                        eligibility: "Data not confirmed.",
                        benefit: "Data not confirmed.",
                        verified: false,
                        source: url
                    });
                }
            });
        } catch (error) {
            console.log(`Error connecting to ${url}`);
        }
    }
    // Saving the findings to your JSON file
    fs.writeFileSync('scraped.json', JSON.stringify(scrapedData, null, 2));
    console.log("Scrape successful!");
}

// Simple rule-based tagging (No AI needed)
function autoTag(name) {
    const tags = [];
    const n = name.toLowerCase();
    if (n.includes('student') || n.includes('shiksha')) tags.push('student');
    if (n.includes('farmer') || n.includes('krishak')) tags.push('farmer');
    if (n.includes('girl') || n.includes('kanya')) tags.push('women');
    return tags;
}

scrape();


const fs = require('fs');

// Load both files
const verified = JSON.parse(fs.readFileSync('verified.json'));
const scraped = JSON.parse(fs.readFileSync('scraped.json'));

// Start with the verified data as the priority
const finalSchemes = [...verified];

scraped.forEach(sItem => {
    // Check if the scheme already exists (case-insensitive)
    const exists = verified.find(vItem => vItem.name.toLowerCase() === sItem.name.toLowerCase());
    
    // Only add if it's a new scheme we don't have yet
    if (!exists) {
        finalSchemes.push(sItem);
    }
});

// Save everything into one final file for the website to use
fs.writeFileSync('schemes.json', JSON.stringify(finalSchemes, null, 2));
console.log("Data merged successfully into schemes.json!");


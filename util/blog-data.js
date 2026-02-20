const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const filePath = path.join(__dirname, "..", "data", "blogs.json");
function readBlogs() {
    try {
        const blogData = fs.readFileSync(filePath);
        const storedBlogs = JSON.parse(blogData);
        return storedBlogs;
    } catch (err) {
        console.error("Error reading blogs:", err);
        return [];
    }
}

function saveBlogs(blogs) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(blogs));
    } catch (err) {
        console.error("Error saving blogs:", err);
    }
}

module.exports = {
    readBlogs: readBlogs,
    saveBlogs: saveBlogs
}
const fs = require("fs");
const { resolve } = require("path");

let posts = [];
let categories = [];

// open file and read data for posts and categories
module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/posts.json", (err, data) => {
            if (err) {
                throw err;
            } else {
                posts = JSON.parse(data);
                resolve();
            }
        });
        fs.readFile("./data/categories.json", (err, data) => {
            if (err) {
                reject("unable to read file");
            } else {
                categories = JSON.parse(data);
                resolve();
            }
        });
    });
};

// see all data for posts
module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        if (posts.length == 0) {
            reject("no results returned");
        } else {
            resolve(posts);
        }
    });
};

// see published
module.exports.getPublishedPosts = function() {
    return new Promise((resolve, reject) => {
        let publishedPosts = [];
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].published == true) {
                publishedPosts.push(posts[i]);
            }
        }
        if (publishedPosts.length == 0) {
            reject("no results returned");
        } else {
            resolve(publishedPosts);
        }
    });
};

// see all data for categories
module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        if (categories.length == 0) {
            reject("no results returned");
        } else {
            resolve(categories);
        }
    });
};

module.exports.addPost = function(postData) {
    return new Promise((resolve, reject) => {
        postData.id = posts.length + 1;
        postData.published = postData.published ? true : false;
        posts.push(postData);
        resolve();
    });
};

module.exports.getPostsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        let postForCategory = [];
        for (var i = 0; i < posts.length; i++) {
            if (posts[i].category == category) {
                postForCategory.push(posts[i]);
            }
        }

        if (postForCategory.length == 0) {
            reject("No Posts to be displayed");
        } else {
            resolve(postForCategory);
        }
    });
};

module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        let MinDatePosts = [];
        for (var i = 0; i < posts.length; i++) {
            if (new Date(posts[i].postDate) >= new Date(minDateStr)) {
                MinDatePosts.push(posts[i]);
            }
        }
        if (MinDatePosts.length == 0) {
            reject("No Posts to be displayed");
        } else {
            resolve(MinDatePosts);
        }
    });
};

module.exports.getPostById = function(id) {
    return new Promise((resolve, reject) => {
        let postForId = [];
        for (var i = 0; i < posts.length; i++) {
            if (posts[i].id == id) {
                postForId.push(posts[i]);
            }
        }
        if (postForId.length == 0) {
            reject("No Posts to be displayed");
        } else {
            resolve(postForId);
        }
    });
};
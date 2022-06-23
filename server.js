/*********************************************************************************
 * WEB322 – Assignment 03
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
 * of this assignment has been copied manually or electronically from any other source 
 * (including 3rd party web sites) or distributed to other students.
 * 
 * Name: Bhavikkumar Hemantbhai Mistry Student ID: 128788213 Date: June 17, 2022
 *
 * Online (Heroku) Link: https://fast-ravine-80770.herokuapp.com/
 *
 ********************************************************************************/
var express = require("express");
var app = express();
var path = require("path"); // use whenever want to send a file
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const data = require("./blog-service.js");
const upload = multer();

var HTTP_PORT = process.env.PORT || 8080;

function onHTTPStart() {
    console.log("Listening on: " + HTTP_PORT);
}

app.use(express.static("static"));

// set cloudinary
cloudinary.config({
    cloud_name: "bhavikm16",
    api_key: "635337313211369",
    api_secret: "nKiB1l1MEEZAvEGwIp52vACMeLA",
    secure: true,
});

// home page
app.get("/", function(req, res) {
    res.redirect("/about");
});

// about page
app.get("/about", function(req, res) {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

// blog data - pulished posts
app.get("/blog", (req, res) => {
    data.getPublishedPosts().then((data) => {
        res.json(data);
    });
});

app.get("/posts", (req, res) => {
    if (req.query.category) {
        data.getPostsByCategory(req.query.category).then((data) => {
            res.json(data);
        });
    } else if (req.query.minDate) {
        data.getPostsByMinDate(req.query.minDate).then((data) => {
            res.json(data);
        });
    } else {
        data.getAllPosts().then((data) => {
            res.json(data);
        });
    }
});

app.get("/post/:id", function(req, res) {
    data.getPostById(req.params.id).then((data) => {
        res.json(data);
    });
});

// all categories
app.get("/categories", (req, res) => {
    data.getCategories().then((data) => {
        res.json(data);
    });
});

app.get("/posts/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views/addPost.html"));
});

app.post("/posts/add", upload.single("featureImage"), (req, res) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }

    upload(req).then((uploaded) => {
        req.body.featureImage = uploaded.url;

        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        data.addPost(req.body).then(() => {
            res.redirect("/posts");
        });
    });
});

// 404 - not found
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

//app.listen(HTTP_PORT, onHTTPStart);
data
    .initialize()
    .then(function() {
        app.listen(HTTP_PORT, onHTTPStart);
    })
    .catch(function(err) {
        console.log("Unable to start the server: " + err);
    });
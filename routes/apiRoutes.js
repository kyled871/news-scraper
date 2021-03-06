var cheerio = require('cheerio');
var axios = require('axios');
var db = require('../models');

module.exports = function(app) {

    // scrapes all of the news headlines, body and links from selected site --------------
    app.get("/api/scrape", function(req, res) {

        axios.get("https://www.techradar.com/news/gaming").then(function(response) {


            var $ = cheerio.load(response.data);

            $('div.listingResults').children('div.listingResult.small').children('a.article-link').children("article.search-result.search-result-news.has-rating")
            .each(function(i, element) {

                var result = {};

                let title = $(element).children('div.content').children('header').children('h3.article-name').text();
                let synopsis = $(element).children('div.content').children('p.synopsis').text();
                let link = $(element).parent('a.article-link').attr('href');


                result.title = title

                result.synopsis = synopsis

                result.link = link

                db.Article.create(result)
                .then(function(dbArticle) {
                })
                .catch(function(err) {
                })

            })
            res.send('Scrape Complete')
        })
    });


    // gets all of articles from the db collection
    app.get("/api/articles", function(req, res) {
        db.Article.find({})
        .populate("note")
        .then(function(result) {
            res.json(result)
        })
        .catch(function(err) {
            res.json(err)
        })
    });


    // gets article from the ObjectId
    app.get("/api/articles/:id", function(req, res) {
        db.Article.findOne({_id: req.params.id})
        .populate("note")
        .then(function(result) {
            res.json(result)
        })
        .catch(function(err) {
            res.json(err)
        })
    });

    
    // creates a note and updates to the specified articles id ---------------------
    app.post("/api/articles/:id", function(req, res) {
        db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {note: dbNote._id}}, {new: true})
        })
        .then(function(result) {

                db.Article.findOne({_id: result._id})
                .populate("note")
                .then(function(result) {
                    res.json(result)
                })
                .catch(function(err) {
                    res.json(err)
                })
            
        })
        .catch(function(err) {
            res.json(err)
        })
    });


    // saves article by id ------------------
    app.post("/api/save-article/:id", function(req, res) {
        db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {isSaved: true}})
        .then(function(result) {
            res.json(result)
        })
        .catch(function(err) {
            res.json(err)
        })
    });


    // unsaves the article by id -------------------------
    app.post("/api/unsave-article/:id", function(req, res) {
        db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {isSaved: false, useFindAndModify: false}})
        .then(function(result) {
            res.json(result)
        })
        .catch(function(err) {
            res.json(err)
        })
    })

    
    // deletes note by id --------------------
    app.get("/api/note/:id", function(req, res) {
        db.Note.deleteOne({_id: req.params.id}, function(err) {
            
        })
        .then(function() {
            res.status(200).end()
        })
        .catch(function(err) {
            res.status(400).send(err)
        })
    });


    // !!!! deletes entire db contents !!!! ------------------------------
    app.get("/api/clear-database", function(req, res) {
        db.Article.deleteMany({})
        .then(function() {
            res.status(200).end()
        })
        .catch(function(err) {
            res.status(400).send(err)
        })

        db.Note.deleteMany({})
        .then(function() {
            res.status(200).end()
        })
        .catch(function(err) {
            res.status(400).send(err)
        })
    })



}

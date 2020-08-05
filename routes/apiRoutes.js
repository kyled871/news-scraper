var cheerio = require('cheerio');
var axios = require('axios');
var db = require('../models');

module.exports = function(app) {

    app.get("/scrape", function(req, res) {

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
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err)
                })

            })
            res.send('Scrape Complete')
        })
    })

}

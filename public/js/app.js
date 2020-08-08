$(document).ready(function() {

    // check to see if any initial articles, if so they're rendered
    getArticles()
    let alreadyScraped = false





    // Scrape Button ---------------
    $(document).on('click', '#scrapeButton', function() {
        scrapeButton()
    })


    // Save Article button --------------
    $(document).on('click', 'button.saveArticle', function() {

        let selectedArticle = $(this).attr('data-id')
        
        $.post('/api/save-article/' + selectedArticle, function(response) {
            getArticles()
        })
    
    })


    // Clear DB button -------------
    $(document).on('click', '#clearButton', function() {
        clearDB()
    })



    function getArticles() {
        
        $.getJSON("/api/articles", function(data) {
            
            if (data.length > 0) {
                alreadyScraped = true    
                $("#articles").html('')
                $('#articles').append('<h3 class="latestNews container-fluid text-center card-header">Latest News:</h3>')
                for (var i = 0; i < data.length; i++) {

                    if (data[i].isSaved === false) {

                        let article = $('<div>');
                        article.addClass('container-fluid article-container rounded')
                        let articleLink = $(`<a data-id="${data[i]._id}"><h3 class="card-header">${data[i].title}</h3></a>`)
                        articleLink.addClass('article-link')
                        articleLink.attr('href', data[i].link)
    
                        let articleBody = $(`<p>${data[i].synopsis}</p>`)
                        articleBody.addClass('article-body card-body')
                        article.append(articleLink)
                        article.append(articleBody)

                        $('#articles').append(article)
    
                        let saveButton = $(`<button data-id=${data[i]._id}>Save Article</button>`)
                        saveButton.addClass('btn btn-success mb-3 ml-2 saveArticle')
                        $(article).append(saveButton)
                    }

                    
                }
                
            } else {
                
                alreadyScraped = false
                let emptyDiv = $('<div>')
                emptyDiv.addClass('container-fluid empty-container rounded')

                emptyDiv.append('<h3 class="text-center card-header container-fluid">There are no articles loaded! :(</h3>')
                $("#articles").html(emptyDiv)


            }
        });
    }
    
    
    function scrapeButton() {

        if (alreadyScraped === false) {
            
            $.get('/api/scrape', function(response) {
                
                getArticles()
            })
            alreadyScraped = true
        } else {
            console.log('Already Scraped!')
        }
    }

    function clearDB() {

        $.get('/api/clear-database', function(response) {
            getArticles()
        })
    }
    

    
    

    








})
$(document).ready(function() {

    // check to see if any initial articles, if so they're rendered
    getArticles()
    let alreadyScraped = false



    $("#articles").html('<h3>There are no articles loaded!</h3>')


    // Scrape Button ---------------
    $(document).on('click', '#scrapeButton', function() {
        scrapeButton()
    })


    // Save Article button --------------
    $(document).on('click', 'button.saveArticle', function() {

        let selectedArticle = $(this).attr('data-id')
        
        console.log(selectedArticle)

        $.post('/api/save-article/' + selectedArticle, function(response) {

            console.log(response)
            getArticles()

        })
    
    })



    function getArticles() {
        
        $.getJSON("/api/articles", function(data) {
            
            if (data.length > 0) {
                alreadyScraped = true    
                $("#articles").html('')
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
                console.log('i am empty')
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
    

    
    

    








})
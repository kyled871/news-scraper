$(document).ready(function() {

    // check to see if any initial articles, if so they're rendered
    getArticles()
    let alreadyScraped = false



    $("#articles").html('<h3>There are no articles loaded!</h3>')

    $(document).on('click', '#scrapeButton', function() {
        scrapeButton()
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
    
                        let saveButton = $(`<button data-id=${data[i]._id} id="saveArticle">Save Article</button>`)
                        saveButton.addClass('btn btn-success mb-3 ml-2')
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
                location.reload()
            })
            getArticles()
            alreadyScraped = true
        } else {
            console.log('Already Scraped!')
        }
    }

    function saveArticle() {

        $.get('/api/save-article', function(response) {
            
        })

        
    }
    

    
    

    








})
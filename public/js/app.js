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

            console.log(data.length)
            
            if (data.length > 0) {
                console.log('i am full')
                alreadyScraped = true    
                $("#articles").html('')
                for (var i = 0; i < data.length; i++) {
                    
                    
                }
                
            } else {
                console.log('i am empty')
            }
        });
    }
    
    
    function scrapeButton() {

        if (alreadyScraped === false) {
            
            $.get('/api/scrape', function(response) {
                
                console.log(response)
                
            })
            getArticles()
            alreadyScraped = true
        } else {
            console.log('Already Scraped!')
        }
    }
    

    
    

    








})
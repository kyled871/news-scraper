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

    // Unsave Article button --------------
    $(document).on('click', 'button.unsaveArticle', function() {

        let selectedArticle = $(this).attr('data-id')
        
        $.post('/api/unsave-article/' + selectedArticle, function(response) {
            getArticles()
        })
    
    })


    // Save Note button -------------------
    $(document).on('click', 'button.saveNote', function() {

        let selectedArticle = $(this).attr('data-id')

        let selectedNote = $(`textarea[data-id="${selectedArticle}"]`).val().trim()


        $.post("/api/articles/" + selectedArticle, {note: selectedNote}, function(data) {

            getArticles()
        })
    })


    $(document).on('click', 'button.removeNote', function() {

        let selectedNote = $(this).attr('data-id')

        $.get("/api/note/" + selectedNote, function(response) {
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
                
                $("#savedArticles").html('')
                $('#savedArticles').append('<h3 class="latestNews container-fluid text-center card-header">Saved:</h3>')


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
                        article.append(saveButton)
                        
                    } else {



                        let article = $('<div>');
                        article.addClass('container-fluid savedArticle-container rounded')

                        let articleLink = $(`<a data-id="${data[i]._id}"><h3 class="card-header">${data[i].title}</h3></a>`)
                        articleLink.addClass('article-link')
                        articleLink.attr('href', data[i].link)
        
                        let articleBody = $(`<p>${data[i].synopsis}</p>`)
                        articleBody.addClass('article-body card-body')

                        let unsaveButton = $(`<button data-id=${data[i]._id}>Unsave Article</button>`)
                        unsaveButton.addClass('btn btn-success mb-3 ml-2 unsaveArticle')

                        let noteBody = $(`<ul data-id="${data[i]._id}" class="notesHeader"><strong class="mb-3">Notes: </strong></ul>`);

                        let noteArea = $(`<textarea data-id="${data[i]._id}" id="noteArea" class="col-4"></textarea>`)
                        
                        let saveNote = $(`<button data-id="${data[i]._id}">Save Note</button>`)
                        saveNote.addClass('btn btn-success mb-3 ml-2 saveNote pull-right')

                        if (data[i].note.length > 0) {

                            data[i].note.forEach(singleNote => {

                                let noteLi = $(`<li data-id="${singleNote._id}"><p class="liNote">- ${singleNote.note}</p></li>`)
                                noteLi.addClass('col-4')
                                let removeNote = $(`<button data-id="${singleNote._id}">Remove</button>`)
                                removeNote.addClass('btn btn-danger mb-3 ml-2 removeNote pull-right')
                                
                                noteBody.append(noteLi)
                                noteBody.append(removeNote)

                                
                            });
                        }
                        
                        article.append(articleLink)
                        article.append(articleBody)
                        article.append(unsaveButton)
                        article.append('<hr>')
                        article.append(noteBody)
                        article.append(noteArea)
                        article.append(saveNote)
        
                        $('#savedArticles').append(article)
        

                    }

                    
                }
                
            } else {
                
                alreadyScraped = false
                let emptyDiv = $('<div>')
                emptyDiv.addClass('container-fluid empty-container rounded')

                emptyDiv.append('<h3 class="text-center card-header container-fluid">There are no articles loaded! :(</h3>')
                $("#articles").html(emptyDiv)


                let emptySave = $('<div>')
                emptySave.addClass('container-fluid empty-container rounded')
                emptySave.append('<h3 class="text-center card-header container-fluid">There are no articles saved! :(</h3>')
                $("#savedArticles").html(emptySave)
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
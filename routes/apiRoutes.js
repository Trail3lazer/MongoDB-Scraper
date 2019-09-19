var scraper = require("../scraper/puppet")

const api = (app, db) => {

    //Scraper
    app.get("/api/scrape", async function (req, res) {
        
        await scraper(db).then((data)=>{
            res.redirect('back');
        })

    });

    // Route for getting all Articles from the db
    app.get("/api/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({}).sort('-date')
            .exec(err, function (dbArticle) {
                if(err)console.log(err);
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/api/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note").sort('-date')
            .exec(function (err, dbArticle) {
                if (err) console.log(err);
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    // Route for saving/updating an Article's associated Note
    app.post("/api/articles/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                return db.Article.updateOne({ _id: req.params.id }, { $push:{note: dbNote._id} });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.post('/api/articles/fave/:id', (req, res) => {
        let fave = req.body['favorite']
        if(fave !== "false"){
            db.Article.updateOne({ _id: req.params.id },
                { $set:{favorite: false}}, 
                [{upsert: true}, {setDefaultsOnInsert: true}] )
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                console.log("Set not fave")

                res.json(dbArticle);
            })
        }else{
            db.Article.updateOne({ _id: req.params.id },
                { $set:{favorite: true}})
            .then(function (dbArticle) {
                console.log("Set fave")
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
        };

    })

    

}

module.exports = api;
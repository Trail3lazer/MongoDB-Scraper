const html = (app, db) => {
    
    app.get('/favorites', (req, res) => {
        db.Article.find({favorite: true}).sort('-date').then((articles) => {
            res.render("home", { articles: articles })
        }).catch(err => { throw err })
    });

    app.get('/*', (req, res) => {
        db.Article.find().sort('-date').then((articles) => {
            res.render("home", { articles: articles })
        }).catch(err => { throw err })
    });

}

module.exports = html;
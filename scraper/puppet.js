const puppeteer = require('puppeteer');
var cheerio = require("cheerio");

async function scrape(db, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.nfl.com/", {
  });
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  
    var $ = cheerio.load(bodyHTML);
  
    $("li div a").each(function(i, element) {
        console.log(element)
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element)
          .text();
        result.link = $(element)
          .attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
    });
    
    await browser.close();
    };

module.exports = scrape;
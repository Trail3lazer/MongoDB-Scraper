const puppeteer = require('puppeteer');
var cheerio = require("cheerio");

async function scrape(db, res) {

    const browser = await puppeteer.launch({
      args: [
        
      ]
    }); 
    const page = await browser.newPage();
    await page.goto("http://www.nfl.com/news");

    await setTimeout(()=>{},  15000);
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);
    
    var $ = cheerio.load(bodyHTML);
  
  
    $("div.news-stream-module").each(function (i, element) {
      var result = {};
  
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element).find("h3")
        .text();
      result.link = $(element).find("h3").children('a')
        .attr("href");
      result.img = $(element).find('img')
        .attr('src');
      result.date = $(element).find("div.published-date")
        .text();
      result.body = $(element).find("p")
        .text().slice(0, -4).trim()
      
        console.log(result)

      // Make sure that the article isn't already saved
      if (
        db.Article.findOne({title: result.title}).then(
          (response)=>{if(response){return true;
        }})
      ){return true;};
      
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          return true;
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  
    await browser.close();
};

module.exports = scrape;
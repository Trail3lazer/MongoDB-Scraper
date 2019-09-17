const puppeteer = require('puppeteer');
var cheerio = require("cheerio");

async function scrape(db, res) {

  const browser = await puppeteer.launch(
    {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
  );
  const page = await browser.newPage();

  console.log("loading page")
  await page.goto("http://www.nfl.com/news", { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('div.news-stream-module');

  console.log("grabbing html")
  let bodyHTML = await page.evaluate(() => document.body.innerHTML);

  console.log("Checking for duplicates & Saving to DB")
  var $ = cheerio.load(bodyHTML);
  $("div.news-stream-module").each(async (i, element) => {
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

    // Make sure that the article isn't already saved /// ---broken ----always returns true

    await db.Article.findOne({ title: result.title },
      (err, duplicate) => {
        if(err) console.log(err);

        if (duplicate !== null) {

          console.log("found duplicate " + duplicate.title);

        } else {
          // Create a new Article using the `result` object built from scraping

          db.Article.create(result, function (err, dbArticle) {
            if (err) console.log(err);

            // View the added result in the console
            console.log("Saved: " + dbArticle.title)
          })
        }
      }
    )
  });
  //end of each

  await browser.close();
};

module.exports = scrape;
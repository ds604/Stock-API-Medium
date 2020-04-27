// Import packages
var router = require('express').Router();
var puppeteer = require('puppeteer');
const chalk = require('chalk');

// Router path
router.route('/stock/:ticker').get(async (req, res) => {
    let ticker = req.ticker;

    const browser = await puppeteer.launch({
        // Set headless to false to view the browser functionality
        headless:false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    let url = `https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`;

    await page.goto(url);
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);
    // Wait for the page to finish rendering
    await page.waitFor('#Col2-8-QuoteModule-Proxy', {timeout: 5000});
    await page.waitFor('#Col2-8-QuoteModule-Proxy > div > section > div > div > div', {timeout: 5000});

    try {

      let recommend = await page.evaluate(() => document.querySelector("#Col2-8-QuoteModule-Proxy > div > section > div > div > div").textContent);
      await browser.close();

      console.log(chalk.green(`Current recommendation for ${ticker} is ${recommend}`));
      res.send({ticker, recommend});

    } catch (e) {
      await browser.close();
      res.send(`Could not determine the recommendation for ${ticker}`);
    }
    
    
});

// Handle the url parameter
router.param('ticker', (req, res, next, ticker) => {
    req.ticker = ticker.toUpperCase();
    next();
});

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

module.exports = router;
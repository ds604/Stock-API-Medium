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
    // Wait for the page to finish rendering
    await page.waitFor('#quote-market-notice', {timeout: 1000});
    // Scrape the stock price from the page
    let price = await page.evaluate(() => document.querySelector("#quote-header-info > div.Pos\\(r\\) > div > div > span").textContent);
    await browser.close();

    // Return the ticker and price
    console.log(chalk.green(`Current stock price for ${ticker} is ${price}`));
    res.send({ticker, price});
});

// Handle the url parameter
router.param('ticker', (req, res, next, ticker) => {
    req.ticker = ticker.toUpperCase();
    next();
});

module.exports = router;
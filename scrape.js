const puppeteer = require('puppeteer'); // require puppeteer

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false}); // open browser
    const page = await browser.newPage(); // open a new browser window
    await page.goto('http://books.toscrape.com/'); // go to URL
    await page.waitFor(1000); // wait for 1s
    // Scrape
    const products = []; // array of products to populate
    let productNum = 1; // set to 1
    for (let i = 1; i <= 100; i++) {
        await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(' + productNum + ') > article > div.image_container > a > img'); // click product img
        const result = await page.evaluate(() => { // run function
            let title = document.querySelector('h1').innerText; // grab product title
            let price = document.querySelector('.price_color').innerText; // grab product price
            let product = { // save title and price to object
                title,
                price
            };
            return product; // return object
        });
        products.push(result); // push current product to array
        await page.goBack(); // go back to previous page
        productNum++; // increment by 1
        if (i % 20 === 0) { // if 20th (last) product on page
            await page.click('#default > div > div > div > div > section > div:nth-child(2) > div > ul > li.next > a'); // click next page button
            productNum = 1; // reset to 1
        }
        console.log(productNum); // log to console
    }


    browser.close(); // close browser
    return products; // return array of products
};

scrape().then((value) => { // invoke function, then do something with value
    console.log(value); // log value to console
});

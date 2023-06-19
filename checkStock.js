import chalk from 'chalk';
import puppeteer from 'puppeteer';
import callClient from './twilio.js';

async function checkStock() {
  callClient(false);
  while (true) {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    // Replace 'url' with the actual URL of the webpage
    await page.goto(
      'https://uk.webuy.com/product-detail/?id=5021290096806&categoryName=playstation5-software&superCatName=gaming&title=final-fantasy-xvi&referredFrom=boxsearch&queryID=76c2bcb0bddf3c8d8deda96175ad6acc&position=1'
    );

    try {
      // Wait for the element containing the stock information to load
      await page.waitForSelector('.productInfoCat.bold.right.bottomclsbordcs', {
        timeout: 5000,
      });

      // Extract the inner text of the stock element
      const stockText = await page.$eval(
        '.productInfoCat.bold.right.bottomclsbordcs',
        element => element.innerText
      );

      // Check if the stock text indicates that the item is in stock
      const isInStock = stockText.includes('In stock online');

      await browser.close();

      if (isInStock) {
        return true;
      }
    } catch (error) {
      console.log(
        chalk.black.bgYellowBright.bold(
          'The item is out of stock. The bot will now automatically restart.'
        )
      );
      await browser.close();
    }

    // Wait for a certain interval before checking again
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// Call the function and handle the result
checkStock()
  .then(isInStock => {
    callClient(true);

    console.log(chalk.white.bgGreenBright.bold('The item is in stock!'));
  })
  .catch(err => {
    console.error(
      chalk.black.bgRedBright.bold(`Whops! An error occurred: ${err}`)
    );
    process.exit(1);
  });

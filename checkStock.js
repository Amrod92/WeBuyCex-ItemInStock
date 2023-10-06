import chalk from 'chalk';
import puppeteer from 'puppeteer';
import readline from 'readline';
import callClient from './twilio.js';

let PRODUCT_NAME;

// Create an interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get the URL from user input
function getURL() {
  return new Promise(resolve => {
    rl.question('Enter the URL of the product: ', url => {
      resolve(url);
    });
  });
}

async function validateAndCheckStock() {
  let url;
  do {
    url = await getURL();
    if (!url.trim()) {
      console.error(chalk.red('URL is empty. Please enter a valid URL.'));
    } else if (!isValidCeXURL(url)) {
      console.error(
        chalk.red(
          'Invalid CeX URL. Please enter a valid CeX product URL starting with https://uk.webuy.com/product-detail/?id='
        )
      );
    }
  } while (!url.trim() || !isValidCeXURL(url));

  await checkStock(url);
}

function isValidCeXURL(url) {
  return url.startsWith('https://uk.webuy.com/product-detail/?id=');
}

async function checkStock(url) {
  callClient(false);

  while (true) {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    // Use the provided URL
    await page.goto(url);

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

      // Extract Product Name
      PRODUCT_NAME = await page.evaluate(() => {
        const element = document.querySelector('.productNamecustm');
        return element.textContent.trim();
      });

      // Check if the stock text indicates that the item is in stock
      const isInStock = stockText.includes('In stock online');

      if (isInStock) {
        // Wait for the element containing the stock information to load
        await page.waitForSelector('#onetrust-accept-btn-handler', {
          hidden: false,
        });

        // Accept cookies
        await page.click('#onetrust-accept-btn-handler');

        // Wait for the element containing the stock information to load
        await page.waitForSelector('#onetrust-accept-btn-handler', {
          hidden: true,
        });

        // Click on the Sign In button
        await page.click('#signIn');

        // Wait for the modal to appear
        await page.waitForSelector('#user', {
          hidden: false,
        });

        // Fill in the email and password fields
        await page.type('#user', 'manlio92--@live.it');
        await page.type('#pass', '123');

        // Take a screenshot of the logged-in state
        await page.screenshot({ path: 'logged_in.png' });

        console.log(
          chalk.white.bgGreenBright.bold(
            `The item ${PRODUCT_NAME} is in stock!`
          )
        );
        process.exit(1);
      }
      await browser.close();
    } catch (error) {
      console.log(
        chalk.black.bgYellowBright.bold(
          'The item is out of stock. The bot will check again in 5 seconds.'
        )
      );
      await browser.close();
      await delay(5000); // Wait for 5 seconds before checking again
    }
  }
}

// Function to introduce a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Call the main function to start the bot
validateAndCheckStock();

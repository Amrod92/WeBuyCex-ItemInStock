const puppeteer = require('puppeteer');

async function checkStock() {
  while (true) {
    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    // Replace 'url' with the actual URL of the webpage
    await page.goto('url');

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
        'The item is out of stock. The bot will now automatically restart.'
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
    console.log('The item is in stock!');
  })
  .catch(err => console.error(err));

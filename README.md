# WeBuy Cex - Stock Monitoring Script 💿

This script uses Puppeteer to monitor the stock status of a webpage in real-time. It checks if a specific element indicating stock availability is present on the page and determines whether the item is in stock or out of stock.

## Prerequisites 📐

- Node.js
- Puppeteer
- Chalk

## Installation 🧪

1. Clone the repository or download the script files.

2. Install the dependencies by running the following command in your terminal:

   ```bash
   npm install puppeteer
   ```

## Usage 🥼

1. Open the script file `checkStock.js` and replace the `url` placeholder in the `page.goto()` function with the actual URL of the webpage you want to monitor. For instace: `https://uk.webuy.com/product-detail?id=045496478728&categoryName=switch-software&superCatName=gaming&title=legend-of-zelda-tears-of-the-kingdom&referredFrom=search&queryID=645adacb38d5824285b518c8878a6018&position=2`

2. Open your terminal and navigate to the project directory.

3. Run the script using the following command:

   ```bash
    node checkStock.js
   ```

   The script will start monitoring the webpage and display the stock status in real-time. If the item is in stock, it will display the message "The item is in stock!". Otherwise, it will continue monitoring until the item becomes available.

4. To stop the script, press `Ctrl + C` in your terminal.

## Customization 💅

- Timeout: By default, the script waits for a maximum of 5 seconds for the stock element to appear on the page. You can modify the timeout option in the `page.waitForSelector()` function to adjust this duration according to your needs.

- Monitoring Interval: By default, the script checks the stock status every 5 seconds. You can modify the duration in the `setTimeout()` function to change the interval between each check.

## License ⚖️

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.

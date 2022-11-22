//const fs = require('fs');
import puppeteer from 'puppeteer';

async function GetImageFromSiteUrl(siteUrl) {
  let images = [];
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('response', async (response) => {
      const url = response.url();
      if (response.request().resourceType() === 'image') {
        response.buffer().then((file) => {
          //console.log('url ==> ', url);
          images.push(url);
          //   const filePath = path.resolve(__dirname, fileName);
          //   const writeStream = fs.createWriteStream(filePath);
          //   writeStream.write(file);
        });
      }
    });
    await page.goto(siteUrl);
    await browser.close();
    await page.close();
    return images;
  } catch (error) {
    //console.log('err ==> ', error);
    return images;
  }
}

export default GetImageFromSiteUrl;

const express = require("express"),
  app = express();
const fs = require("fs"); // Or `import fs from "fs";` with ESM

const puppeteer = require("puppeteer");
app.get("/", async (req, res) => {
  res.send("ok");
});
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
app.get("/shoot", async (req, res) => {
  try {
    let fileTokenPath =
      __dirname + "/public/estate/" + req.query.tokenId + ".png";
    if (fs.existsSync(fileTokenPath) && !req.query.live) {
      res.sendFile(fileTokenPath);
    } else {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 500, height: 500 });

      await page.goto(
        "https://metaearthsbs.surge.sh/estate-view?id=" + req.query.tokenId
      );
      console.log("Page loading");
      // await delay(20000);
      await page.waitForSelector("#is-renderred");
      console.log("Page is renderred");

      await page.screenshot({
        path: fileTokenPath,
      });
      await browser.close();
      res.sendFile(fileTokenPath);
    }
  } catch (error) {
    console.log(error);
  }
});

var listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

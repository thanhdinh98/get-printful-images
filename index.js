const fetch = require("node-fetch");
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");

const urls = [
  "https://static.cdn.printful.com/dist/app/css/sitewide-search.2e7e640809da092bd38d.css",
  "https://static.cdn.printful.com/dist/app/css/components~myorders/css/components.1ead0f34401f43d3ffe9.css",
  "https://static.cdn.printful.com/dist/app/css/layout~myorders/css/layout.22898dfdb7bcb5ff955b.css",
  "https://static.cdn.printful.com/dist/app/css/layout-sass~myorders/css/layout-sass.44bd5618b2ef05639c86.css",
  "https://static.cdn.printful.com/dist/app/css/pages.32a63868eeac0fb7b78a.css",
  "https://static.cdn.printful.com/dist/app/css/popup.main.ae3ffcb57e1d37b2df04.css",
  "https://static.cdn.printful.com/dist/app/css/dashboard.5298471dd24f10fd3e1b.css",
  "https://static.cdn.printful.com/dist/app/css/mockup-generator.112183937f3ddab91f23.css",
  "https://static.cdn.printful.com/dist/app/css/proactive-message.c37242f9c2ecdd134e23.css",
  "https://static.cdn.printful.com/dist/app/css/review-form.f7a82000272a11d81afa.css",
  "https://static.cdn.printful.com/dist/app/css/review-slideout.bed11ade7f763c56b0d9.css",
  "https://static.cdn.printful.com/dist/app/css/products-pricing.dcafcbe1676aba477967.css",
  "https://static.cdn.printful.com/dist/app/css/products-catalog.daec1c0bf7b3e0d8f281.css",
];

(async () => {
  for (const url of urls) {
    try {
      const css = await fetch(url);
      const body = await css.text();
      const links = body.match(
        /([\/|.|\w|\s|@|-])*\.(?:jpg|svg|png|eot|ttf|woff|gif|jpeg|woff2)/gim
      );
      const formatLinks = links.filter((link) => link.includes("static"));

      const folders = formatLinks.map((link) => {
        const a = link.split("/");
        a.pop();
        return a.join("/");
      });

      folders.forEach((folder) => {
        mkdirp.sync(path.join(__dirname, folder));
      });

      formatLinks.forEach(async (link) => {
        const fileStream = fs.createWriteStream(path.join(__dirname, link));
        const res = await fetch(`https://printful.com/${link}`);
        res.body.pipe(fileStream);
        res.body.on("error", (err) => {
          console.error(err);
        });
        fileStream.on("finish", function () {
          console.log(`finish: ${link}`);
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
})();

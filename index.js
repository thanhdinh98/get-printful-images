const fetch = require('node-fetch');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');

const myArgs = process.argv.slice(2);

(async () => {
  try {
    const css = await fetch(myArgs[0]);
    const body = await css.text();
    const links = body.match(/([\/|.|\w|\s|-])*\.(?:jpg|svg|png)/gmi);
    const formatLinks = links.filter((link) => link.includes('static'));

    const folders = formatLinks.map(link => {
      const a = link.split('/');
      a.pop();
      return a.join('/');
    })

    folders.forEach((folder) => {
      mkdirp.sync(path.join(__dirname, folder));
    })

    formatLinks.forEach(async (link) => {
      const fileStream = fs.createWriteStream(path.join(__dirname, link));
      const res = await fetch(`https://printful.com${link}`);
      res.body.pipe(fileStream);
      res.body.on("error", (err) => {
        console.error(err);
      });
      fileStream.on("finish", function () {
        console.log(`finish: ${link}`)
      });
    })
  } catch (err) {
    console.error(err)
  }
})()
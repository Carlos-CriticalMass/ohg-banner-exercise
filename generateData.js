import pkg from './package.json';
import fs from 'fs';
import path from 'path';
import fileBytes from 'file-bytes';
import prettyBytes from 'pretty-bytes';
import glob from 'glob';

module.exports = function() {
  let SRC_PATH = "src/banner_list";
  let SRC_PATH_ZIPS = "dist/ZIPS/*";
  let FOLDER = getFolders(SRC_PATH);
  let sizeArray = [];

  function getFolders(dir) {
    return fs.readdirSync(dir).filter(function() {
      return fs.statSync(path.join(dir)).isDirectory();
    });
  }

  let files = glob.sync(SRC_PATH_ZIPS);

  for (let file of files) {
    const size = prettyBytes(fileBytes.sync(file));
    sizeArray.push(size);
  }

  let getDir = FOLDER.filter(path => path !== ".DS_Store");

  let getDirUrl = FOLDER.filter(path => path !== ".DS_Store").map(
    path => `${path}/index.html`
  );

  const data = {};
  data.info = [];

  const obj = {
    campaign: pkg.campaign,
    advertiser: pkg.advertiser,
    disclaimer: pkg.disclaimer,
    sizes: getDir,
    path: getDirUrl,
    fileSize: sizeArray
  };

  data.info.push(obj);

  fs.writeFile("./src/data.json", JSON.stringify(data), function(err) {
    if (err) throw err;
  });

  return getDir;
};

const fs = require('fs')
const path = require('path');
const readline = require('readline');

const _ = require('lodash')
const moment = require('moment')

const gatsbyConfig = require('../gatsby-config');

let filesystemOption = _.head(_.filter(gatsbyConfig.plugins, {
    resolve: 'gatsby-source-filesystem',
    options: { name: 'blog' }
}));

if (filesystemOption === undefined) {
  console.error(`No 'gatsby-source-filesystem' configuration for 'blog'.`)
  process.exit(1);
}
//
//
let now = moment();
var yearMonthPath = now.format('./YYYY/MM/');
let blogDatePath = path.resolve(filesystemOption.options.path, yearMonthPath);

let draftsPath = path.resolve(filesystemOption.options.path, './drafts');
let rlInterface = readline.createInterface(process.stdin, process.stdout, null);
rlInterface.question('draft name: ', blogTitle => {
  rlInterface.close();

  let draftFilePath = path.resolve(draftsPath, `${blogTitle}.md`);
  let draftText = fs.readFileSync(draftFilePath, 'utf8');


  let newBlogFilePath = path.resolve(blogDatePath, `${now.date()}_${blogTitle}.md`);
  fs.writeFile(newBlogFilePath, draftText, { flag: 'wx' }, err => {
    if (err) throw err;
    console.log(newBlogFilePath);

    fs.unlink(draftFilePath, unlinkErr =>{
      if (unlinkErr) throw err;
    });
  });
});

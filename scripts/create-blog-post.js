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

let now = moment();
var yearMonthPath = now.format('./YYYY/MM/');
let blogDatePath = path.resolve(filesystemOption.options.path, yearMonthPath);

function buildBlogTemplateString(title, date) {
  return `---\ntitle: ${title}\ndate: "${date}"\n---\n`;
}

function slugify(str) {
  return str
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();
}

let rlInterface = readline.createInterface(process.stdin, process.stdout, null);
rlInterface.question('title: ', blogTitle => {
  let newBlogTitle = `${_.isEmpty(blogTitle) ? 'New Blog' : blogTitle}`;
  let templateString = buildBlogTemplateString(newBlogTitle, now.format('YYYY/MM/DD'));
  let newBlogSlug = slugify(newBlogTitle);
  let newBlogFilePath = path.resolve(blogDatePath, `${now.date()}_${newBlogSlug}.md`;

  fs.writeFile(newBlogFilePath, templateString, { flag: 'wx' }, err => {
      if (err) throw err;
      console.log(newBlogFilePath);
      rlInterface.close();
  });
});

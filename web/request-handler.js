var path = require('path');
var fs = require('fs');
var mimetypes = require('mime-types');
var archive = require('../helpers/archive-helpers');
var httphelper = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  console.log('recieved method: ' + req.method + ' url: ' + req.url);

  let basename = path.posix.basename(req.url);
  let headers = httphelper.headers;


  // let parser = document.createElement('a');
  // parser.href = basename;

  if (req.method === 'GET') {
    if (basename === '') {
      fs.readFile(`${archive.paths.siteAssets}/index.html`, (err, data) => {
        if (err) {
          // TODO: Maybe return a status code on error
          console.log('ERROR: problem reading file');
        } else {
          res.writeHeader(200, headers);
          res.end(data);
        }
      });
    } else {
      // let pathname = parser.pathname;
      let basePath = archive.paths.siteAssets;
      // if (pathname.includes('/web/public/')) {
      //   basePath = archive.paths.archivedSites;
      // }

      console.log('PATH:', `${basePath}/${basename}`);
      fs.readFile(`${basePath}/${basename}`, (err, data) => {
        if (err) {
          // TODO: Maybe return a status code on error
          console.log('ERROR: problem reading file -', basename);
        } else {
          headers['Content-Type'] = mimetypes.lookup(basename);
          res.writeHeader(200, headers);
          res.end(data);
        }
      });
    }
  }

  // res.end(archive.paths.list);
};

var path = require('path');
var fs = require('fs');
var mimetypes = require('mime-types');
var archive = require('../helpers/archive-helpers');
var httphelper = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  console.log('recieved method: ' + req.method + ' url: ' + req.url);

  // let parser = document.createElement('a');

  let basename = path.posix.basename(req.url);
  let headers = httphelper.headers;

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
      fs.readFile(`${archive.paths.siteAssets}/${basename}`, (err, data) => {
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

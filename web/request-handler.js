var path = require('path');
var fs = require('fs');
var mimetypes = require('mime-types');
var archive = require('../helpers/archive-helpers');
var httphelper = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  console.log('recieved method: ' + req.method + ' url: ' + req.url);

  let basename = path.posix.basename(req.url);
  let headers = httphelper.headers;

  if (req.method === 'GET') {
    if (basename === '') {
      fs.readFile(`${archive.paths.siteAssets}/index.html`, (err, data) => {
        if (err) {
          console.log('ERROR: problem reading file - index.html');
          res.writeHeader(404, headers);
          res.end(data);
        } else {
          res.writeHeader(200, headers);
          res.end(data);
        }
      });
    } else {
      let basePath = archive.paths.siteAssets;
      console.log('PATH:', `${basePath}/${basename}`);
      fs.readFile(`${basePath}/${basename}`, (err, data) => {
        if (err) {
          console.log('ERROR: problem reading file -', basename);
          res.writeHeader(404, headers);
          res.end(data);
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

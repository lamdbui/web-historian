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
      httphelper.serveAssets(res, `${archive.paths.siteAssets}/index.html`);
    } else {
      fs.access(`${archive.paths.siteAssets}/${basename}`, fs.constants.F_OK, (err) => {
        if (err) {
          fs.access(`${archive.paths.archivedSites}/${basename}`, fs.constants.F_OK, (err) => {

            archive.isUrlInList(basename, function(result){
              if (result) {
                archive.isUrlArchived(basename, function(result){
                  if (result) {
                    headers['Content-Type'] = 'text/html';
                    httphelper.serveAssets(res, `${archive.paths.archivedSites}/${basename}`);
                  } else {
                    headers['Content-Type'] = 'text/html';
                    httphelper.serveAssets(res, `${archive.paths.siteAssets}/loading.html`);
                  }
                });
              } else {
                archive.addUrlToList(basename, function(){
                  console.log(basename + "added to archives/sites.txt");
                });
                headers['Content-Type'] = 'text/html';
                httphelper.serveAssets(res, `${archive.paths.siteAssets}/loading.html`);
              }
            });

            if (err) {
              console.log('ERROR: problem reading file -', basename);
              res.writeHeader(404, headers);
              res.end();
            } else {
              headers['Content-Type'] = 'text/html';
              httphelper.serveAssets(res, `${archive.paths.archivedSites}/${basename}`);
            }
          });
        } else {
          headers['Content-Type'] = mimetypes.lookup(basename);
          httphelper.serveAssets(res, `${archive.paths.siteAssets}/${basename}`);
        }
      });
    }
  }
};

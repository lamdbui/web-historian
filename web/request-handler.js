var path = require('path');
var fs = require('fs');
var mimetypes = require('mime-types');
var archive = require('../helpers/archive-helpers');
var httphelper = require('./http-helpers');
var querystring = require('querystring');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  console.log('recieved method: ' + req.method + ' url: ' + req.url);

  let basename = path.posix.basename(req.url);
  let headers = httphelper.headers;

  if (req.method === 'POST') {
    // parse the query string
    // figure out the location
    //
    console.log(basename);


    req.on('data', function(data){
      console.log(data.toString());
      var queryparams = querystring.parse(data.toString());

      headers['Location'] = `/${queryparams.url}`;
      headers['Content-Type'] = 'text/html';
      res.writeHeader(302, headers);
      res.end();
    });


  } else if (req.method === 'GET') {
    if (basename === '') {
      headers['Content-Type'] = 'text/html';
      httphelper.serveAssets(res, `${archive.paths.siteAssets}/index.html`);
    } else {
      fs.access(`${archive.paths.siteAssets}/${basename}`, fs.constants.F_OK, (err) => {
        if (err) {
          fs.access(`${archive.paths.archivedSites}/${basename}`, fs.constants.F_OK, (err) => {

            if (err) {
              archive.isUrlInList(basename, function(result) {

                if (result) {
                  // send loading.html
                  headers['Content-Type'] = 'text/html';
                  httphelper.serveAssets(res, `${archive.paths.siteAssets}/loading.html`);
                } else {
                  archive.addUrlToList(basename, function(){
                    console.log(basename + "added to archives/sites.txt");
                    console.log('ERROR: problem reading file -', basename);
                    headers['Content-Type'] = 'text/html';

                    // res.writeHeader(404, headers);
                    // res.end();

                    fs.readFile(`${archive.paths.siteAssets}/loading.html`, (err, data) => {
                      if (err) {
                        console.log('ERROR: problem reading file -', asset);
                        res.writeHeader(404, exports.headers);
                        res.end(data);
                      } else {

                        res.writeHeader(404, exports.headers);
                        res.end(data);
                      }
                    });
                  });
                }
              });
            } else {
              headers['Content-Type'] = 'text/html';
              httphelper.serveAssets(res, `${archive.paths.archivedSites}/${basename}`);
            }
            // 302 redirects to GET
            // if website string is in sites.txt
            // look in the sites folder
              // check for site content
                // if false return loading html
              // if found return site content
            // if string is not in sites.txt
              // add string to sites.txt
              // return loading.html (inform users)
            // archive.isUrlInList(basename, function(result){
            //   if (result) {
            //     archive.isUrlArchived(basename, function(result){
            //       if (result) {
            //         headers['Content-Type'] = 'text/html';
            //         httphelper.serveAssets(res, `${archive.paths.archivedSites}/${basename}`);
            //       } else {
            //         headers['Content-Type'] = 'text/html';
            //         httphelper.serveAssets(res, `${archive.paths.siteAssets}/loading.html`);
            //       }
            //     });
            //   } else {
            //     archive.addUrlToList(basename, function(){
            //       console.log(basename + "added to archives/sites.txt");
            //     });
            //     headers['Content-Type'] = 'text/html';
            //     httphelper.serveAssets(res, `${archive.paths.siteAssets}/loading.html`);
            //   }
            // });

            // if (err) {
            //   console.log('ERROR: problem reading file -', basename);
            //   res.writeHeader(404, headers);
            //   res.end();
            // } else {
            //   headers['Content-Type'] = 'text/html';
            //   httphelper.serveAssets(res, `${archive.paths.archivedSites}/${basename}`);
            // }
          });
        } else {
          headers['Content-Type'] = mimetypes.lookup(basename);
          httphelper.serveAssets(res, `${archive.paths.siteAssets}/${basename}`);
        }
      });
    }
  }
};

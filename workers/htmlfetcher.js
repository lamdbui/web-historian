var https = require('https');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
// go through the sites.txt file
  // fetch the contents of the sites
  // save the contents to file locally


exports.fetch = function() {
  var sites;
  archive.readListOfUrls(function(results){
    sites = results;
    sites.forEach(function(site){

      https.get(options, function(res) {
        const statusCode = res.statusCode;

        if (statusCode !== 200){
          console.log('Not able to fetch ', site);
        } else {
          res.on('data', function(data){
            // write to sites folder
            fs.appendFile(`${archive.paths.archivedSites}/${site}`, data.toString(), function(err){
              if (err) {
                console.log('Failed fetching site: ', site);
              } else {
                console.log('Succeeded fetching ', site);
              }
            });
          });
        }
      });
    });
  });
};

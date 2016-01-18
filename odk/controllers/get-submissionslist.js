const fs = require('fs');
const settings = require('../../settings');
const Url = require('../../util/url');

/**
 * Provides metadata as JSON of the public directories of
 * survey submissions as well as the applicable aggregate
 * endpoints.
 */
module.exports = function (req, res, next) {
    const dir = settings.publicDir + '/submissions/';
    fs.readdir(dir, function (err, files) {
        const urls = [];
        if (err) {
            // Submissions directory doesn't exist if submissions have not yet been made.
            // This is a normal situation, so we should just send back an array showing
            // that we just don't have any submissions yet.
            if (err.errno === -2) {
                res.status(200).json([]);
                return;
            }
            // This is some other error state...
            res.status(500).json({
                status: 500,
                msg: 'There was a problem reading the submissions directory. dir: ' + dir,
                err: err
            });
            return;
        }
        for (var i = 0, len = files.length; i < len; i++) {
            var file = files[i];
            if (file[0] === '.') continue;
            var originalUrl = req.originalUrl;
            if (originalUrl[originalUrl.length-1] !== '/') originalUrl += '/';
            var url = Url.apiUrl(req, originalUrl + file + '.json');
            urls.push(url);
        }
        res.status(200).json(urls);
    });
};

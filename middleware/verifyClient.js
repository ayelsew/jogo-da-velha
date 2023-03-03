const url = require('url');

module.exports = function (info, cb) {
    const origin = info.origin;
    const req = info.req;
    const secure = info.secure;
    req.parsedBody = url.parse(req.url, true).query;

    if (typeof req.parsedBody['clientID'] == 'undefined')
        cb(false, 403, 'A ID do cliente não foi passada.');

    req.clientId = req.parsedBody['clientID'];
    cb(true, 200);
}
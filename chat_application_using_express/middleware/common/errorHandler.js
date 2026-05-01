const createError = require('http-errors');

function notFoundHandler(req, res, next) {
    next(createError(404, 'Your reqested content was not found'));
}
function errorHandler(err, req, res, next) {
    res.locals.error = process.env.NODE_ENV === 'development' ? err : { message: err.message };

    res.status(err.status || 500);
    if (res.locals.html) {
        // html response
        res.render('error', {
            title: 'Error page',
        });
    } else {
        // json response response
        res.json(res.locals.error);
    }
}

module.exports = {
    notFoundHandler,
    errorHandler,
};

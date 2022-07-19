const { Response, ResponseError } = require("./../common/Response");

module.exports = (err, req, res, next) => {
  const error = new ResponseError({
    status: err.status || 500,
    msg: err.msg || err.message || "No MSG",
    reason: err.reason || err.stack || "Somebody failed",
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(error.status);
  res.json(
    new Response({
      status: false,
      error,
    })
  );
};

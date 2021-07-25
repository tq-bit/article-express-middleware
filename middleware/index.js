function accessLog(req, res, next) {
  const { hostname, method, path, ip, protocol } = req
  console.log(`ACCESS: ${method} ${protocol}://${hostname}${path} - ${ip}`);
  next();

}

function errorLog(err, req, res, next) {
  const { hostname, method, path, protocol } = req
  console.log(`ERROR: ${method} ${protocol}://${hostname}${path} - ${err}`);
  // next(); // you can call either next or send a uniform error response
  res.status(500).send({ status: "server-error", message: err.message });
}

function setHeaders(req, res, next) {
  // Allows resource sharing for clients that are hosted on
  // Different domains. Useful for public APIs
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Restrict http - methods to a chosen few. This applies only
  // When the browser sends a Preflight request, e.g. when using
  // window.fetch().
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE, OPTIONS");

  // Add some basic cache control for requesting browsers
  res.setHeader("Cache-Control", "private, max-age=120");

  // Use this header to cache files that do not change often,
  // e.g. static HTML, CSS or Javascript for 5 days
  // res.setHeader("Cache-Control", "public, max-age=432000, immutable")

  // If you want no cache at all, uncomment this header
  // res.setHeader("Cache-Control": "no-store, max-age=0")

  // You can also remove standard headers. In case of express,
  // the following will get rid of the X-Powered-By header
  res.removeHeader('X-Powered-By');
  next();
}

function validateUser(req, res, next) {
  const auth = req.headers.authorization;

  // If the client does not send auth - header, send a 401 response
  if (!auth) {
    return res.status(401).send({
      status: 'not-authenticated',
      message: 'The request does not contain a valid access header'
    })
  }

  // res.locals is commonly used to store temporary request data
  req.locals = { user: { name: null } };

  // Extract the username and password from the authroization header
  const baseValue = auth.replace('Basic ', '').trim();
  const baseString = Buffer.from(baseValue, 'base64').toString('utf-8');
  const [username, password] = baseString.split(':');

  // Check if user is permitted to access this resource
  if (username === 'user' && password === 'supersecret123') {
    req.locals.user.name = username;
    // Call next only if user may access paths protected by this middleware
    return next();
  } else {
    return res.status(403).send({
      status: 'not-authorized',
      message: 'You are not permitted to access this resource'
    })
  }
}

module.exports = { accessLog, errorLog, setHeaders, validateUser }
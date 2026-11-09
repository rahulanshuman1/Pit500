const jwt = require('jsonwebtoken');

// Requires "Authorization: Bearer <JWT>". Rejects anything else with 401.
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required. Send a Bearer token.' });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    return next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError' ? 'Session expired. Sign in again.' : 'Invalid token. Sign in again.';
    return res.status(401).json({ message });
  }
};

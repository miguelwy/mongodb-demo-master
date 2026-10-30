const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

// Presenter tools answer only to the machine running the server. A proxy or tunnel
// also connects from loopback, so forwarded requests are refused too.
export function presenterOnly(req, res, next) {
  const local = LOOPBACK.has(req.socket.remoteAddress);
  const forwarded = req.headers['x-forwarded-for'] || req.headers.forwarded;
  const crossSite = req.headers['sec-fetch-site'] === 'cross-site';
  if (local && !forwarded && !crossSite) return next();
  res.status(404).end();
}

const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Access denied. Admin rights required.' });
    }
    next();
  };
  
  module.exports = adminAuth;
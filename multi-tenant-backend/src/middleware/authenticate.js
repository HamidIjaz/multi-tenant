const passport = require("passport");

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authenticate;

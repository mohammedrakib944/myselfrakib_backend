const jose = require("jose");

// Check if the user is Authenticate or not
const checkAuth = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return next("Please login!");
  }
  try {
    // verify token
    const secret = new TextEncoder().encode(process.env.KEY);
    await jose.jwtVerify(token, secret);
    next();
  } catch (err) {
    next("You are not a valid user!");
  }
};

module.exports = checkAuth;

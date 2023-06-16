const jose = require("jose");

// Local Username or pasword
const adminuser = process.env.ADMINUSER;
const adminpassword = process.env.PASSWORD;

// LOGIN USER
exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  // Check the given usrname or password
  if (adminuser !== username || adminpassword !== password) {
    return next("Wrong credintials!");
  }
  // Login process
  try {
    // Create Jose TOKEN
    const secret = new TextEncoder().encode("rakib@^secret#key");
    const joseToken = await new jose.SignJWT({ user: "Rakib" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    // Set timer 61 min
    // var tokenTime = new Date(new Date().getTime() + 61 * 60 * 1000);
    // const options = {
    //   expires: tokenTime,
    //   httpOnly: true,
    //   secure: true,
    // };

    // Set cookie
    // res.cookie("access_token", joseToken, options);

    // Set Response
    res.json({
      status: "success",
      message: "Login Success!",
      data: { user: "Rakib", access_token: joseToken },
    });
  } catch (err) {
    let message = err.message || "Internal error!";
    return next(message);
  }
};

// SEND REFRESH TOKEN
exports.refreshToken = async (req, res, next) => {
  try {
    // Create Jose TOKEN
    const secret = new TextEncoder().encode("rakib-refresh-token");
    const joseToken = await new jose.SignJWT({ token: "refresh" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);
    // Send Refresh Token
    res.json({ status: "success", token: joseToken });
  } catch (err) {
    let message = err.message || "Refresh token error!";
    return next(message);
  }
};

// LOGOUT USER
exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.json({
      status: "success",
      message: "Logout Success!",
    });
  } catch (err) {
    let message = err.message || "Internal error!";
    return next(message);
  }
};

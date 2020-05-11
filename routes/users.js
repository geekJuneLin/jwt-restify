const error = require("restify-errors");
const brypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (server) => {
  // Register user
  server.post("/register", (req, res, next) => {
    const { email, password } = req.body;

    console.log(`email: ${email}, password: ${password}`);

    const newUser = new User({
      email,
      password,
    });

    brypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(
          new error.InternalServerError(`Registering new user with ${err}`)
        );
      }
      brypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          return next(
            new error.InternalServerError(`Registering new user with ${err}`)
          );
        } else {
          newUser.password = hash;
          console.log(newUser);

          // Save the new user
          newUser
            .save()
            .then((user) => res.send(user))
            .catch((err) => {
              return next(
                new error.InternalServerError(
                  `Registering new user with ${err}`
                )
              );
            });
        }
      });
    });

    next();
  });

  // Auth user
  server.post("/auth", (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return next(new error.UnauthorizedError("email not matched!"));
        } else {
          brypt
            .compare(password, user.password)
            .then((match) => {
              if (!match) {
                return next(
                  new error.UnauthorizedError("password not matched!")
                );
              } else {
                // Generate the token
                const token = jwt.sign(user.toJSON(), config.jwt_secret, {
                  expiresIn: "1h",
                });

                console.log(`token: ${token}`);
                res.send(token);
              }
            })
            .catch((err) => {
              return next(new error.InternalServerError(err));
            });
        }
      })
      .catch((err) => {
        return next(new error.InternalServerError(err));
      });
  });
};

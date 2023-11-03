const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { SECRET_KEY } = require("../utils/config");
const SECRET_KEY = require("../utils/config");

const Users = require("../models/user");

console.log(SECRET_KEY);

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ForbiddenError = require("../errors/forbidden-error");
const ConflictError = require("../errors/conflict-error");

// GET /users/:userId - returns logged-in user by _id
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  Users.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from getUser"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Error from getUser"));
      } else {
        next(e);
      }
    });
};

// PATCH /users/:userId - update user data
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  Users.findByIdAndUpdate(
    userId,
    { $set: { name, avatar } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from updateUser"));
      } else if (e.name === "ValidationError") {
        next(new BadRequestError("Error from updateUser"));
      } else {
        next(e);
      }
    });
};

// POST /users — creates a new user
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Error from createUser"));
  }
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError("Email already exist"));
      }
      return bcrypt.hash(password, 10).then((hash) =>
        Users.create({ name, avatar, email, password: hash })
          .then((newUser) => {
            const token = jwt.sign({ _id: newUser._id }, SECRET_KEY, {
              expiresIn: "7d",
            });
            res.status(200).send({
              data: {
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar,
              },
              token,
            });
          })
          .catch((e) => {
            console.error(e);
            if (e.name === "ValidationError") {
              next(new BadRequestError("Error from createUser"));
            } else {
              next(e);
            }
          }),
      );
    })
    .catch(() => {
      next(e);
    });
};

// POST /users — signin user
const login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: "7d",
      });
      res.send({ user, token });
    })
    .catch((err) => {
      next(new UnauthorizedError("Error from signinUser"));
    });
};

module.exports = { getCurrentUser, updateUser, createUser, login };

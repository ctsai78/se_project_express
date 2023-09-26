const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_KEY } = require("../utils/config");
const Users = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  NOT_AUTHORIZED,
  DUPLICATE_EMAIL,
} = require("../utils/errors");

// GET /users/:userId - returns logged-in user by _id
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  Users.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Error from getUser" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Error from getUser" });
      } else {
        res
          .status(DEFAULT)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// PATCH /users/:userId - update user data
const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  Users.findByIdAndUpdate(
    userId,
    { $set: { name, avatar } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Error from updateUser" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Error from updateUser" });
      } else {
        res
          .status(DEFAULT)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// POST /users — creates a new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    res.status(BAD_REQUEST).send({ message: "Error from createUser" });
  }
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(DUPLICATE_EMAIL)
          .send({ message: "Email already exist" });
      }
      return bcrypt.hash(password, 10).then((hash) =>
        Users.create({ name, avatar, email, password: hash })
          .then((newUser) => {
            res.status(200).send({
              data: {
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar,
              },
            });
          })
          .catch((e) => {
            if (e.name === "ValidationError") {
              res
                .status(BAD_REQUEST)
                .send({ message: "Error from createUser" });
            } else {
              res
                .status(DEFAULT)
                .send({ message: "An error has occurred on the server." });
            }
          }),
      );
    })
    .catch(() => {
      res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(NOT_AUTHORIZED).send({ message: err.message });
    });
};

module.exports = { getCurrentUser, updateUser, createUser, login };

/* -------------------------------- NOT USED -------------------------------- */

// GET /users — returns all users
// const getUsers = (req, res) => {
//   Users.find({})
//     .then((users) => res.status(200).send(users))
//     .catch(() => {
//       res.status(DEFAULT).send({ message: "Error from getUsers" });
//     });
// };

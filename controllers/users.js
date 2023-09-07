const Users = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

// GET /users — returns all users
const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      res.status(DEFAULT).send({ message: "Error from getUsers" });
    });
};

// GET /users/:userId - returns a user by _id
const getUser = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Error from getUser" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Error from getUser" });
      } else {
        res.status(DEFAULT);
      }
    });
};

// POST /users — creates a new user
const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar } = req.body;

  Users.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(BAD_REQUEST).send({ message: "Error from createUser" });
      } else {
        res.status(DEFAULT);
      }
    });
};

module.exports = { getUsers, getUser, createUser };

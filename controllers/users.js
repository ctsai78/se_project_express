const Users = require("../models/user");

// GET /users — returns all users
const getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      res.status(500).send({ message: "Error from getUsers", e });
    });
};

// GET /users/:userId - returns a user by _id
const getUser = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail((e) => {
      res.status(404).send({ message: "No user found with that id", e });
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      res.status(400).send({ message: "Error from getUser", e });
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
      res.status(400).send({ message: "Error from createUser", e });
    });
};

module.exports = { getUsers, getUser, createUser };

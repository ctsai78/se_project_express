const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

// GET /users/me — returns logged-in user
router.get("/me/:userId", getCurrentUser);

// PATCH /users/me — update profile
router.patch("/me/:userId", updateUser);

module.exports = router;

/* -------------------------------- NOT USED -------------------------------- */
// const { getUsers, getUser, createUser } = require("../controllers/users");

// GET /users — returns all users
// router.get("/", getUsers);

// GET /users/:userId - returns a user by _id
// router.get("/:userId", getUser);

// POST /users — creates a new user
// router.post("/", createUser);

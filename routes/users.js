const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");

// GET /users/me — returns logged-in user
router.get("/me", auth, getCurrentUser);

// PATCH /users/me — update profile
router.patch("/me", auth, validateUpdateUser, updateUser);

module.exports = router;

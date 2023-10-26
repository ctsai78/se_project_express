const router = require("express").Router();
const clothingItem = require("./clothingItems");
const user = require("./users");
const { createUser, login } = require("../controllers/users");
const NotFoundError = require("../errors/not-found-err");
const {
  validatedUserLogin,
  validateUserBody,
} = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", user);

router.post("/signin", validatedUserLogin, login);
router.post("/signup", validateUserBody, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;

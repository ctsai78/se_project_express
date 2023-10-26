const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const { validateCardBody, validateId } = require("../middlewares/validation");

// CRUD

// Create
router.post("/", auth, validateCardBody, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", auth, validateId, deleteItem);

// Like
router.put("/:itemId/likes", auth, validateId, likeItem);

// Dislike
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;

/* -------------------------------- NOT USED -------------------------------- */

// // Update
// router.put("/:itemId", updateItem);

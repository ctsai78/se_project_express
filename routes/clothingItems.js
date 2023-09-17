const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", auth, createItem);

// Read
router.get("/", getItems);

// Delete
router.delete("/:itemId", auth, deleteItem);

// Like
router.put("/:itemId/likes", auth, likeItem);

// Dislike
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;

/* -------------------------------- NOT USED -------------------------------- */

// // Update
// router.put("/:itemId", updateItem);

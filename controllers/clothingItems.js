const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  NOT_OWNER,
  DEFAULT,
} = require("../utils/errors");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-error");

// Create
const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Error from createItem"));
      } else {
        res
          .status(DEFAULT)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// Read
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

// Delete

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        return res
          .status(NOT_OWNER)
          .send({ message: "You are not authorized to delete this item" });
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from deleteItem"));
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Error from deleteItem" });
      } else {
        res
          .status(DEFAULT)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

// Like Item
const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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

// Dislike Item
const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
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

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};

/* -------------------------------- NOT USED -------------------------------- */

// Update
// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       res.status(500).send({ message: "Error from updateItems"});
//     });
// };

/* ------------------------------- Backup Code ------------------------------ */

// // Create
// const createItem = (req, res) => {
//   const { name, imageUrl, weather } = req.body;

//   ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch((e) => {
//       if (e.name === "ValidationError") {
//         res.status(BAD_REQUEST).send({ message: "Error from createItem" });
//       } else {
//         res
//           .status(DEFAULT)
//           .send({ message: "An error has occurred on the server." });
//       }
//     });
// };

// // Read
// const getItems = (req, res) => {
//   ClothingItem.find({})
//     .then((items) => res.status(200).send(items))
//     .catch(() => {
//       res
//         .status(DEFAULT)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// // Delete

// const deleteItem = (req, res) => {
//   const { itemId } = req.params;

//   ClothingItem.findById(itemId)
//     .orFail()
//     .then((item) => {
//       if (String(item.owner) !== req.user._id) {
//         return res
//           .status(NOT_OWNER)
//           .send({ message: "You are not authorized to delete this item" });
//       }
//       return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
//     })
//     .catch((e) => {
//       if (e.name === "DocumentNotFoundError") {
//         res.status(NOT_FOUND).send({ message: "Error from deleteItem" });
//       } else if (e.name === "CastError") {
//         res.status(BAD_REQUEST).send({ message: "Error from deleteItem" });
//       } else {
//         res
//           .status(DEFAULT)
//           .send({ message: "An error has occurred on the server." });
//       }
//     });
// };

// // Like Item
// const likeItem = (req, res) =>
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
//     { new: true },
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       if (e.name === "DocumentNotFoundError") {
//         res.status(NOT_FOUND).send({ message: "Error from getUser" });
//       } else if (e.name === "CastError") {
//         res.status(BAD_REQUEST).send({ message: "Error from getUser" });
//       } else {
//         res
//           .status(DEFAULT)
//           .send({ message: "An error has occurred on the server." });
//       }
//     });

// // Dislike Item
// const dislikeItem = (req, res) =>
//   ClothingItem.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } }, // remove _id from the array
//     { new: true },
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((e) => {
//       if (e.name === "DocumentNotFoundError") {
//         res.status(NOT_FOUND).send({ message: "Error from getUser" });
//       } else if (e.name === "CastError") {
//         res.status(BAD_REQUEST).send({ message: "Error from getUser" });
//       } else {
//         res
//           .status(DEFAULT)
//           .send({ message: "An error has occurred on the server." });
//       }
//     });

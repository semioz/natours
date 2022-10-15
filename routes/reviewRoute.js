const express = require("express");
const authController = require("./../controllers/authController.js");
const reviewController = require("./../controllers/reviewController.js");
const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restricTo("user"), reviewController.createReview)

router
    .route("/:id")
    .delete(reviewController.deleteReview)

module.exports = router;
const express = require("express");
const authController = require("./../controllers/authController.js");
const reviewController = require("./../controllers/reviewController.js");
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(authController.restricTo("user"), reviewController.setTourUserIds, reviewController.createReview)

router
    .route("/:id")
    .get(reviewController.getReview)
    .patch(authController.restricTo("user", "admin"), reviewController.updateReview)
    .delete(authController.restricTo("user", "admin"), reviewController.deleteReview)

module.exports = router;
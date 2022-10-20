const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController.js");
const reviewRouter = require("./../routes/reviewRoute.js")
const router = express.Router();

router
    .route("/top-5-cheap")
    //first paramater is a middleware to get the cheapest tours
    .get(tourController.aliasTopTours, tourController.getAllTours)

router.use("/:tourId:reviews", reviewRouter)

router
    .route("/monthly-plan/:year")
    .get(authController.protect, authController.restricTo("admin", "lead-guide", "guide"), tourController.getMonthlyPlan)

router
    .route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(tourController.getToursWithin);

router
    .route("/distances/:latlng/unit/:unit")
    .get(tourController.getDistances)

router
    .route("/tour-stats")
    .get(tourController.getTourStats)

router
    .route("/")
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restricTo("admin", "lead-guide"), tourController.createTour)

router
    .route("/:id")
    .get(tourController.getTour)
    .delete(authController.protect, authController.restricTo("admin", "lead-guide"), tourController.deleteTour)
    .patch(authController.protect, authController.restricTo("admin", "lead-guide"), tourController.updateTour)

module.exports = router;
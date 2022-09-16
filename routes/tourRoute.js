const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController.js");
const router = express.Router();

router
    .route("/top-5-cheap")
    //first paramater is a middleware to get the cheapest tours
    .get(tourController.aliasTopTours, tourController.getAllTours)

router
    .route("/monthly-plan/:year")
    .get(tourController.getMonthlyPlan)

router
    .route("/tour-stats")
    .get(tourController.getTourStats)

router
    .route("/")
    //the first paramater which is a middleware, will protect this resource from users that not logged in.
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour)

router
    .route("/:id")
    .get(tourController.getTour)
    .delete(tourController.deleteTour)
    .patch(tourController.updateTour)

module.exports = router;
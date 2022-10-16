const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

router.use(authController.protect);

router.patch("/update-my-password", authController.updatePassword)
router.patch("/update-me", userController.updateMe);
router.get("/me", userController.getMe, userController.getUser)
router.patch("/delete-me", userController.deleteMe);

router.use(authController.restricTo("admin"));

router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser)

router
    .route("/:id")
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser)

module.exports = router;
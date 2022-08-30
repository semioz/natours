const express = require("express");
const router = express.Router();

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};
const getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};
const createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};
const deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};
const updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};


router
    .route("/")
    .get(getAllUsers)
    .post(createUser)

router
    .route("/:id")
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser)

module.exports = router;
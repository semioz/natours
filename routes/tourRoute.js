const express = require("express");
const router = express.Router();
const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        time: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    })
}

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(element => element.id === id)

    if (!tour) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })
}

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);

    if (!tour) {
        return res.status(404).send({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const updatedTour = {...tour, ...req.body };
    const updatedTours = tours.map(tour =>
        tour.id === updatedTour.id ? updatedTour : tour
    );

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(updatedTours),
        err => {
            res.status(200).send({
                status: 'success',
                data: updatedTour
            });
        }
    );
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);
    //Check if the ID matches with an existing tour ID
    if (!tour) {
        return res.status(404).send({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    const updatedTours = tours.filter(t => t.id !== tour.id);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(updatedTours),
        err => {
            res.status(204).send({
                status: 'success',
                data: null
            });
        }
    )
};

router
    .route("/")
    .get(getAllTours)
    .post(createTour)

router
    .route("/:id")
    .get(getTour)
    .delete(deleteTour)
    .patch(updateTour)

module.exports = router;
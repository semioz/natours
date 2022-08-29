const fs = require("fs");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours
        }
    })
});
app.get("/api/v1/tours/:id", (req, res) => {
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
});

app.post("/api/v1/tours", (req, res) => {
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
})

app.patch("/api/v1/tours/:id", (req, res) => {
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
});

app.delete("/api/v1/tours/:id", (req, res) => {
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
    );
})

app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}...`);
})
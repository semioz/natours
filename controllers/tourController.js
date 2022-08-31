const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

//Check if the ID matches with an existing tour ID
exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "Fail",
            message: "Invalid ID"
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.body.name ||  !req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "Body must contain 'price' and 'name' properties."
        })
    }
    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        time: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    })
}

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(element => element.id === id)

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
}

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);

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

exports.deleteTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(tour => tour.id === id);
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
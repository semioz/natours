const fs = require("fs");
const express = require("express");
const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 3000;

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use((req, res, next) => {
    console.log("This is the middleware...");
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//Route Handlers
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

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

//Mounting Tour Route and User Route

const tourRouter = express.Router();
const userRouter = express.Router();
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

tourRouter
    .route("/")
    .get(getAllTours)
    .post(createTour)

tourRouter
    .route("/:id")
    .get(getTour)
    .delete(deleteTour)
    .patch(updateTour)

//User Route
userRouter
    .route("/")
    .get(getAllUsers)
    .post(createUser)

userRouter
    .route("/:id")
    .get(getUser)
    .delete(deleteUser)
    .patch(updateUser)

//Server
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}...`);
})
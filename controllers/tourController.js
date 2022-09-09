const Tour = require("./../models/tourModel");
const APIfeatures = require("./../utils/apiFeatures");

//creating a middleware to get the 5 cheapest tours
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sortFields = "-ratingsAverage, price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next();
};

exports.getAllTours = async(req, res) => {
    try {
        //EXECUTE QUERY, invoke the class constructor with 'new' !
        const features = new APIfeatures(Tour.find(), req.query)
            .filter()
            .sortFields()
            .limitFields()
            .paginate();
        const tours = await features.query;

        res.status(200).json({
            status: "success",
            time: req.requestTime,
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            "message": err
        })
    }
};

exports.getTour = async(req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};

exports.createTour = async(req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
};

exports.updateTour = async(req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};

exports.deleteTour = async(req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};
//aggregation pipeline
exports.getTourStats = async(req, res) => {
    try {
        const stats = await Tour.aggregate([{
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            //sort after the group stage
            { $sort: { avgPrice: 1 } }
        ]);
        res.status(200).json({
            status: "success",
            data:  {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};

exports.getMonthlyPlan = async(req, res) => {
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([{
                //after implementing unwind, we do have 27 documents instead of 9 documents. because each document has 3 dates.
                $unwind: "$startDates"
            },
            {
                $match: {
                    startDates: {
                        //only show the tours whose "startDates" year is input year.
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$startDates" },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: "$name" }
                }
            },
            {
                $addFields: { month: "$_id" }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 6
            }
        ]);
        res.status(200).json({
            status: "success",
            data:  {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err
        })
    }
};
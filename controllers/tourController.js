const AppError = require("../utils/appError");
const Tour = require("./../models/tourModel");
const APIfeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync.js");
const factory = require("./../controllers/handlerFactory.js");

//creating a middleware to get the 5 cheapest tours
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = "5";
    req.query.sortFields = "-ratingsAverage, price";
    req.query.fields = "name,price,ratingsAverage,summary,difficulty"
    next();
};

exports.getAllTours = catchAsync(async(req, res) => {
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
});

exports.getTour = catchAsync(async(req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate("reviews")
    if (!tour) {
        return next(new AppError("No tour find with that ID!", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    })
});

exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

//aggregation pipeline
exports.getTourStats = catchAsync(async(req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async(req, res) => {
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
});
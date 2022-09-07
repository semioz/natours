const Tour = require("./../modals/tourModule");
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
            message: "Invalid Data Sent"
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
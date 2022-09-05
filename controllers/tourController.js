const Tour = require("./../modals/tourModule");

exports.getAllTours = async(req, res) => {
    try {
        //BUILD QUERY
        const queryObj = {...req.query };
        const excludedFields = ["page", "sort", "limit", "field"];
        excludedFields.forEach(el => delete queryObj[el]);
        //ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr))
        let query = Tour.find(JSON.parse(queryStr))
            //SORTING
        if (req.query.sort) {
            //SORT BY MULTIPLE PARAMETERS
            const sortBy = req.query.sort.split(',').join(' ')
            console.log(sortBy)
            query = query.sort(sortBy)
        } else {
            //SORT BY CREATED DATE IF USER DOES NOT SPECIFY ANY ARGUMENT
            query = query.sort("-createdAt");
        }
        //FIELD LIMITING
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        } else {
            query = query.select("-__v");
        }



        //EXECUTE QUERY
        const tours = await query;
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
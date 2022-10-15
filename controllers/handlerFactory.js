const AppError = require("./../utils/appError.js");
const catchAsync = require("./../utils/catchAsync.js");

exports.deleteOne = Model => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) {
        return next(new AppError("No document find with that ID!", 404))
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
});
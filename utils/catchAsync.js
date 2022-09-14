module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    };
};
//in order to get rid of multiple try-catch blocks, define a function like that
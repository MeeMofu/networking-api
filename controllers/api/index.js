const router = require('express').Router();
const userRoute = require('./user-routes');
const thoughtRoute = require('./thought-routes');

router.use('/users',userRoute);
router.use('/thoughts',thoughtRoute);

module.exports = router;
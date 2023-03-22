let express = require('express');
const { news } = require('../APIs/News/getNews');
const { recursionCall } = require('../APIs/Recusion Call/recursionCall');
const { weather } = require('../APIs/Weather/getWeather');

let router = express.Router();

router.post('/', function (req, res, next) {
  res.send("This is only for APIs calls")
});

router.post('/getWeather', weather);
router.post('/getNews', news);
router.post('/refreashAllData', recursionCall);

module.exports = router;

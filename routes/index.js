var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '移动应用分析平台', highlight: '#' });
});
router.get('/test_index', function(req, res, next) {
  res.render('test_index', { title: 'Express' });
});
router.get('/LibRadar', function(req, res, next) {
  res.render('LibRadar', {title: 'LibRadar', highlight:'LibRadar'});
});

module.exports = router;

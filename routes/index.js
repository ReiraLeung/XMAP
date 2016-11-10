var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '移动应用分析平台', highlight: '#' });
});
router.get('/test_index', function(req, res, next) {
  res.render('new_index', { title: 'Express' });
});
router.get('/LibRadar', function(req, res, next) {
  res.render('LibRadar', {title: 'LibRadar', highlight:'LibRadar'});
});
router.get('/RiskEva', function(req, res, next) {
  res.render('RiskEva', {title: 'RiskEva', highlight:'RiskEva'});
});
module.exports = router;

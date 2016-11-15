var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/androidrank';
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main_content', { title: '移动应用分析平台', highlight: '#' });
});
router.get('/test_index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function(req, res, next) {
  var category = req.query.category;
  var sort_Type = "rank";
  var up_down = 1;
  if(req.query.sort==1) {
    sort_Type = "total_rating";
    up_down = -1;
  }
  if(req.query.sort==2) {
    sort_Type = "average_rating";
    up_down = -1;
  }
  var start_point = req.query.start;

  var findDocuments = function (db) {
    var collection = db.collection('maap');
    collection.find().sort( { sort_Type :up_down}).skip(start_point-1).limit(10).toArray(function (err, docs) {
      if (!err) {
        console.log("Found the following records");
        res.render('list', {
          title: 'list',
          sort: sort_Type,
          start: start_point,
          list: docs,
        });
      }
       else {
         console.log("Not Found");
         return;
       }
   });
  }
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    findDocuments(db);
  });

});

router.get('/LibRadar', function(req, res, next) {
  res.render('LibRadar', {title: 'LibRadar', highlight:'LibRadar'});
});
router.get('/RiskEva', function(req, res, next) {
  res.render('RiskEva', {title: 'RiskEva', highlight:'RiskEva'});
});
module.exports = router;

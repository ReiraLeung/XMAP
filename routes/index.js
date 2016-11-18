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
  var categorystring = ""+req.query.category;
  var sort_Type = {"rank":1};
  if(req.query.sort=='1') {
    sort_Type = {"total_rating":-1};
  }
  if(req.query.sort=='2') {
    sort_Type = {"installs_estimated":-1};
  }
  var category = {};
  if(categorystring != ""){
    categorystring = categorystring.replace(/_/g,' ');
    category = {"category":categorystring};
  }
  var start_point = parseInt(req.query.start,10);

  var findDocuments = function (db) {
    var collection = db.collection('maap');
    console.log(collection.find(category).count());
    var counts = "";
    var result = collection.find(category).count(function(err,docs){
      if(!err){
        counts = docs;
        console.log(counts);
      }
    });

    collection.find(category).sort(sort_Type).skip(start_point-1).limit(20).toArray(function (err, docs) {
      if (!err) {
        console.log(sort_Type);
        console.log(category);
        console.log(counts);
        console.log("Found the following records");
        res.render('list', {
          title: 'list',
          counts: counts,
          cate: categorystring,
          sort: req.query.sort,
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

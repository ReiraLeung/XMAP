var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://localhost:27017/androidrank';
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Founding");
  var findDocuments = function (db) {
    var collection = db.collection('maap');
    collection.find().sort({"rank": 1}).limit(24).toArray(function (err, docs) {
      if (!err) {
        console.log("Found the following records");
        console.log(docs.length);
        res.render('main_content', {
          title: '移动应用分析平台',
          list: docs,
          highlight: '#'
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
router.get('/test_index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/list', function(req, res, next) {

});

router.get('/LibRadar', function(req, res, next) {
  res.render('LibRadar', {title: 'LibRadar', highlight:'LibRadar'});
});
router.get('/RiskEva', function(req, res, next) {
  res.render('RiskEva', {title: 'RiskEva', highlight:'RiskEva'});
});

router.get('/application', function (req, res, next) {

  var findDocuments = function (db, package_name) {
    var collection = db.collection('maap');
    collection.find({"package_name": package_name}).toArray(function (err, docs) {
      if (!err) {
        var result = docs[0];
        if (result != null) {

          console.log("Found the following records");
          //console.log(result["riskEva"]);
          res.render('appinfo', {
            title: 'RiskEva Result',
            original_name: package_name,
            name: result["name"],
            image:result["image"],
            cate:result["category"],
            libs: JSON.stringify(result["libs"]),
            time_c: "find in Database, consume 0 s",
            perms: result["riskEva"]
          });
        }
        else {
          console.log("Not Found");
          db.close();
          return;
        }
      }
      else {
        console.log("Not Found");
        return null;
      }
    });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    findDocuments(db, req.query.app);
  });
});

router.get('/search', function(req, res, next) {

  var findDocuments = function (db, package_name) {
    var collection = db.collection('maap');
    collection.find({"package_name": package_name}).toArray(function (err, docs) {
      if (!err) {
        var result = docs[0];
        if (result != null) {

          console.log("Found the following records");
          console.log(result["riskEva"]);
          res.render('appinfo', {
            title: 'RiskEva Result',
            original_name: package_name,
            libs: JSON.stringify(result["libs"]),
            time_c: "find in Database, consume 0 s",
            name: result["name"],
            image:result["image"],
            cate:result["category"],
            perms: result["riskEva"]
          });
        }
        else {
          console.log("Not Found");
          res.render('RiskEva', {title: 'RiskEva', highlight:'RiskEva'});
          db.close();
          return;
        }
      }
      else {
        console.log("Not Found");
        res.render('RiskEva', {title: 'RiskEva', highlight:'RiskEva'});
        return null;
      }
    });
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    findDocuments(db, req.query.appname);
  });
});
module.exports = router;

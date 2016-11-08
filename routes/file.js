/**
 * Created by zach on 15/10/28.
 */

var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var child_process = require('child_process');

var log4js = require('log4js');
var fs = require('fs');

// Mkdir Files.
if (!fs.existsSync('public/files')) {
    fs.mkdirSync('public/files');
}
if (!fs.existsSync('public/files2')) {
    fs.mkdirSync('public/files2');
}
if (!fs.existsSync('public/files3')) {
    fs.mkdirSync('public/files3');
}
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}



// Log Configure.
log4js.configure({
    appenders: [
        { type: 'console' }, //控制台输出
        {
            type: 'file', //文件输出
            filename: 'logs/ip_access.log',
            maxLogSize: 1024,
            backups:3,
            category: 'ip'
        },
        {
            type: 'file', //文件输出
            filename: 'logs/result.log',
            maxLogSize: 1024,
            backups:3,
            category: 'res'
        },
        {
            type: 'file', //文件输出
            filename: 'logs/app.log',
            maxLogSize: 1024,
            backups:3,
            category: 'app'
        }
    ]
});

ip_log = log4js.getLogger("ip");
res_log = log4js.getLogger("res");
/* App Name Mapping */
app_log = log4js.getLogger("app");

/* Get IP */
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

/*上传处理*/
router.post('/uploading', function(req, res, next){
    ip_log.warn(' U1 - ' + getClientIp(req));
    //生成multiparty对象，并配置下载目标路径
    res_log.warn(' U1 - ' + getClientIp(req));
    var form = new multiparty.Form({uploadDir: './public/files/'});
    //下载后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        console.log(filesTmp);
        var file_original_name = "";
        if(err){
            console.log('parse error: ' + err);
        } else {
            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            file_original_name = inputFile.originalFilename;
            app_log.warn(uploadedPath + "," + getClientIp(req) + "," + file_original_name);
        }
        var exec =child_process.exec;
        pcwd = process.cwd();
        var cmdStr = 'python '+ pcwd +'/LibRadar/main/main.py ' + pcwd + '/' + uploadedPath;
        console.log(cmdStr);
        exec(cmdStr, function(err, stdout, stderr){
            if (err) {
                console.log('Error' + cmdStr);
                res.render('result2', {title: 'Error Occurred', libs: 'None', raw: stderr});
            } else {
                res_log.info(stdout);
                var sp = stdout.split('--Splitter--');
                var apktool = sp[0];
                var libs = sp[1];
                var time_consuming = sp[3];
                res.render('result2', {title: 'LibRadar Result', original_name: file_original_name, apktool: apktool, libs: libs, time_c: time_consuming, raw: stdout});
            }
        });
    });
});


/*上传处理Ajax*/
router.post('/uploading2', function(req, res, next){
    ip_log.warn(' U2 - ' + getClientIp(req));
    //生成multiparty对象，并配置下载目标路径
    res_log.warn(' U2 - ' + getClientIp(req));
    var form = new multiparty.Form({uploadDir: './public/files2/'});
    //下载后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        console.log(filesTmp);
        var file_original_name = "";
        if(err){
            console.log('parse error: ' + err);
        } else {

            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            file_original_name = inputFile.originalFilename;
            app_log.warn(uploadedPath + "," + getClientIp(req) + "," + file_original_name);
        }
        var exec = child_process.exec;
        pcwd = process.cwd()
        var cmdStr = 'python '+ pcwd +'/LibRadar/main/main.py ' + pcwd + '/' + uploadedPath;
        cmdStr = cmdStr.replace('\\', '/');
        console.log(cmdStr);
        console.log("TGST\n");
        exec(cmdStr, function(err, stdout, stderr){
            if (err) {
                console.log('Error of ' + cmdStr);
                console.log("STDOUT" + stdout);
                console.log((stderr));
                res.render('result2', {title: 'Error Occurred', libs: 'None', raw: stderr});
            } else {
                res_log.info(stdout);
                var sp = stdout.split('--Splitter--');
                var apktool = sp[0];
                var libs = sp[1];
                var time_consuming = sp[3];
                res.render('result2', {title: 'LibRadar Result', original_name: file_original_name, apktool: apktool, libs: libs, time_c: time_consuming, raw: stdout});
            }
        });
    });
});

/*上传处理shengf*/
router.post('/uploading3', function(req, res, next){
    ip_log.warn(' U3 - ' + getClientIp(req));
    //生成multiparty对象，并配置下载目标路径
    res_log.warn(' U3 - ' + getClientIp(req));
    var form = new multiparty.Form({uploadDir: './public/files3/'});
    //下载后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        console.log(filesTmp);
        var file_original_name = "";
        if(err){
            console.log('parse error: ' + err);
            res.render('error', {title: 'Parse Error', message: 'Parse Error Occurred', error: err});
        } else {
            if (!files || !files.file || !files.file[0] || !files.file[0].path) {
                res.render('Error', {title: 'Content Name Error', message: 'Content Name is not \'file\''});
            } else {
                var inputFile = files.file[0];
                var uploadedPath = inputFile.path;
                file_original_name = inputFile.originalFilename;
                app_log.warn(uploadedPath + "," + getClientIp(req) + "," + file_original_name);
                var exec = require('child_process').exec;
                pcwd = process.cwd()
                var cmdStr = 'python ' + pcwd + '/LibRadar/main/main.py ' + pcwd + '/' + uploadedPath;
                console.log(cmdStr);
                exec(cmdStr, function (err, stdout, stderr) {
                    if (err) {
                        console.log('Error' + cmdStr);
                        res.render('result2', {title: 'Error Occurred', libs: 'None', raw: stderr});
                    } else {
                        res_log.info(stdout);
                        var sp = stdout.split('--Splitter--');
                        var apktool = sp[0];
                        var libs = sp[1];

                        var time_consuming = sp[3];
                        /*
                        res.render('result2', {
                            title: 'LibRadar Result',
                            original_name: file_original_name,
                            apktool: apktool,
                            libs: libs,
                            time_c: time_consuming,
                            raw: stdout
                        });
                        */
                        res.setHeader('Content-Type', 'application/json');
                        res.setHeader('Content-Length', libs.length);
                        res.end(libs);

                        /*
                        res.send(body)
                         */
                    }
                });
            }
        }
    });
});

/*上传处理Ajax*/
router.post('/uploading4', function(req, res, next) {
    ip_log.warn(' U2 - ' + getClientIp(req));
    //生成multiparty对象，并配置下载目标路径
    res_log.warn(' U2 - ' + getClientIp(req));
    var form = new multiparty.Form({uploadDir: './public/files2/'});
    //下载后处理
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        console.log(filesTmp);
        var file_original_name = "";
        if (err) {
            console.log('parse error: ' + err);
        } else {
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            file_original_name = inputFile.originalFilename;
            app_log.warn(uploadedPath + "," + getClientIp(req) + "," + file_original_name);
        }
        var MongoClient = require('mongodb').MongoClient, assert = require('assert');

        // Connection URL
        var decodedandget= function () {
            console.log("be decodeed")

            var exec = child_process.exec;
            pcwd = process.cwd()
            var cmdStr = 'python ' + pcwd + '/LibRadar/main/main.py ' + pcwd + '/' + uploadedPath;
            console.log(cmdStr);
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    console.log('Error' + cmdStr);
                    res.render('result2', {title: 'Error Occurred', libs: 'None', raw: stderr});
                } else {
                    success1 = true;
                    res_log.info(stdout);
                    var sp = stdout.split('--Splitter--');
                    var apktoolInfo = sp[0];
                    var libs = sp[1];
                    var time_consumming = sp[3];
                    var newPath = sp[4]
                    cmdStr = 'java -jar ' + pcwd + '/RiskEva/RiskEva2.0.jar ' + newPath + ' ' + file_original_name;
                    cmdStr = cmdStr.replace('\n', '');
                    cmdStr = cmdStr.replace('\n', '');
                    console.log(cmdStr);
                    exec(cmdStr, function (err, stdout, stderr) {
                        if (err) {
                            console.log('Error ' + cmdStr);
                            console.log("libs:\n" + libs);
                            res.render('result2', {
                                title: 'Error Occurred',
                                libs: libs,
                                time_c: time_consumming,
                                raw: stderr
                            });
                        } else {
                            var permissions = stdout;
                            res.render('result2', {
                                title: 'RiskEva Result',
                                original_name: file_original_name,
                                libs: libs,
                                time_c: time_consumming,
                                perms: permissions,
                            });
                        }
                    });
                }
            });
        }

        var findDocuments = function (db, package_name) {
            var collection = db.collection('maap');
            collection.find({"package_name": package_name}).toArray(function (err, docs) {
                if (!err) {
                    console.log("Found the following records");
                    var result = docs[0];
                    if (result != null) {
                        console.log("find in db get here!");

                        console.log(result["libs"]);
                        res.render('result2', {
                            title: 'RiskEva Result',
                            original_name: package_name,
                            libs: JSON.stringify(result["libs"]),
                            time_c: "find in Database, consume 0 s",
                            perms: JSON.stringify(result["riskEva"])
                        });
                    }
                    else {
                        console.log("Not Found");
                        db.close();
                        decodedandget();
                        return;
                    }
                }
                else {
                    console.log("not Found");
                    decodedandget();
                    return null;
                }
            });
        }

        // use the findDocuments() function
        var MongoClient = require('mongodb').MongoClient, assert = require('assert');
        var file_name = file_original_name.replace(".apk", "");
        var url = 'mongodb://localhost:27017/androidrank';
        // Use connect method to connect to the server
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server");
            findDocuments(db, file_name);

        });
    });
});
module.exports = router;
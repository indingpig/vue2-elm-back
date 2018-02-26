var MongoClient = require('mongodb').MongoClient;
var DBconfig = require('./config').DBconfig;
var Mongo = require('mongodb')
var ObjectID = Mongo.ObjectID;

var DBconfig = DBconfig;



var operate = {
    insertOne: function(collectionName, json, callback) {  // 插入一条数据；
        this.connect(function (erro, db,client) {
            if (erro) throw erro;
            db.collection(collectionName).insert(json, function (error, result) {
                callback(error, result);
                client.close();
            })
        })
    },
    find: function(collectionName, json, callback) { //查询，功能待加强
        var result = [];
        this.connect(function(erro, db, client) {
            if (erro) throw erro;
            var cursor = db.collection(collectionName).find(json);
            console.log(`${json}`)
            // var cursor = db.collection(collectionName).find({"sex":"female"});
            cursor.each(function (error, doc) {
                if (error) throw error;
                if (doc != null) {
                    result.push(doc)
                    console.log(doc)
                } else {
                    client.close();
                    callback(error, result)
                }
            })
        })
    },
    count: function (collectionName, json, callback) { //查询文档item数量；
        this.connect(function(erro, db, client) {
            if (erro) throw erro;
            db.collection(collectionName).count(json, function(erro, result) {
                callback(erro, result);
                client.close();
            })
        })
    },
    connect: function(_callback){
        MongoClient.connect(DBconfig.url, function(err, client){
            var db = client.db(DBconfig.dbName)
            if (err) {
                console.log('数据库链接失败');
                _callback(err, null);
                return
            }
            _callback(err, db, client);
        })
    }
}
// operate.insert('aaaaa')
exports.DBOpera = operate;
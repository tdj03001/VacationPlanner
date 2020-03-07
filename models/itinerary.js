const orm = require("../config/orm.js");

const itinerary = {
  selectOne: function(cb){
    orm.selectOne("itinerary", function(res){
      cb(res)
    })
  },
  insertOne: function(cols, vals, cb){
    orm.insertOne("itinerary", cols, vals, function(res){
      cb(res);
    })
  },
  update: function(cols, vals, cb){
    orm.update("itinerary", cols, vals, function(res){
      cb(res);
    })
  }
}

module.exports = itinerary;
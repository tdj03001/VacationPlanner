module.exports = function(sequelize, DataTypes){
  var Itinerary = sequelize.define("Itinerary", {
    userName:{
      type: DataTypes.STRING,
      allowNull: true
    },
    xid:{
      type: DataTypes.STRING,
      allowNull: false
    }
  })
  return Itinerary;
}

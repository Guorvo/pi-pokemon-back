const { DataTypes } = require('sequelize');
// Exporting a function that defines the model
// Later we inject the connection to sequelize
module.exports = (sequelize) => {
  // We define the model

  // I used an UUID to differenciate from the API calls
  sequelize.define('pokemon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    // In the pokemon videogames, the values had a maximum of 8 bytes of data, so thats why the limit is 255
    hp: {
      type: DataTypes.INTEGER,
      validate: {max: 255, min: 1}
    },
    attack: {
      type: DataTypes.INTEGER,
      validate: {max: 255, min: 1}
    },
    defense: {
      type: DataTypes.INTEGER,
      validate: {max: 255, min: 1}
    },
    speed: {
      type: DataTypes.INTEGER,
      validate: {max: 255, min: 1}
    },
    height: {
      type: DataTypes.INTEGER,
      validate: { min: 0}
    },
    weight: {
      type: DataTypes.INTEGER,
      validate: {min: 0}
    },
    image: {
      type: DataTypes.STRING(1000),
      isUrl: true,
    },
    // This value is used to verify more easily a database pokemon from a api pokemon
    dbContent:{
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  },
  // we dont truly need timestams so bye-bye!
    { timestamps: false });
};
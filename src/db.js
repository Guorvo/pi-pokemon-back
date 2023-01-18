const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const {
  DB_USER, DB_PASSWORD, DB_HOST,
} = process.env; // I had a problem trying to find the dotenv file, so i added a path to find it...
console.log(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`)
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// We read all the files from the Models folder, require them and add to the modelDefiners array
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// We inject the connection (sequelize) to all models
modelDefiners.forEach(model => model(sequelize));
// We capitalize the names of the models ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// In sequelize.models are all imported models as properties
// To relate them we make a destructuring
const { Pokemon, Type } = sequelize.models;

// Here comes the relationships
var PokemonTypes = sequelize.define('Pokemon_Types', {}, {timestamps: false})
Type.belongsToMany(Pokemon, {through: PokemonTypes});
Pokemon.belongsToMany(Type, {through: PokemonTypes});
module.exports = {
  ...sequelize.models, // to be able to import the models like this: const { Product, User } = require('./db.js');
  conn: sequelize,     // to import the connection { conn } = require('./db.js');
};

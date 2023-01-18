const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define('type', {
		// A simple type table, with only a name and an id, as the README required, tbh i wanted it to be a name only but it is what it is *shrugs*
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	// we dont truly need timestams so bye-bye!
		{ timestamps: false });
};
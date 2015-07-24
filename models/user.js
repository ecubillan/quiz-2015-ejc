// Definicion del modelo de User con validación

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('User', 
		{ username:  { type: DataTypes.STRING,
			           validate: { notEmpty: { msg: "-> Falta nombre de usuario" } } }, 
		  password: { type: DataTypes.STRING,
			           validate: { notEmpty: { msg: "-> Falta password" } } }, 
	});
}

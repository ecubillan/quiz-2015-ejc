var models = require('../models/models.js');

// Comprueba si el usuario esta registrado en tabla User
// Si autenticacion falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
	models.User.find({where: { username: login }}).then(function(user) {
		if(user){
			if(password === user.password){
				callback(null, user);
			} else {
				callback(new Error('Password erróneo'));
			}
		} else {
			callback(new Error('No existe el usuario'));
		}
	});
};

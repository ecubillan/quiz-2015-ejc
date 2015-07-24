var path = require('path');

// Postgres DATABASE_URL=postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL=sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd, 
		{ dialect:  protocol, 
		  protocol: protocol,
		  port:     port,
		  host:     host,
		  storage:  storage, // solo SQLite (.env)
		  omitNull: true     // solo Postgres
		}
	);

// Importar la definicion de la table Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar la definicion de la table Comment en comment.js
var Comment = sequelize.import(path.join(__dirname, 'comment'));
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Importar la definicion de la tabla User en users.js
var User = sequelize.import(path.join(__dirname, 'user'));

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definición de tabla Comment
exports.User = User; // exportar definición de tabla User

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(count === 0) { // la tabla se inicializa solo si está vacía
			Quiz.create({ pregunta: 'Capital de Italia', 
						  respuesta: 'Roma',
						  tema: 'humanidades'
						});
			Quiz.create({ pregunta: 'Capital de Portugal', 
						  respuesta: 'Lisboa',
						  tema: 'humanidades'
						})
			.then(function() { console.log('Base de datos inicializada')});
		};
	});

	// inicializar tabla de usuarios por defecto del Curso
	User.count().then(function(count){
		if(count === 0) { // la tabla se inicializa solo si está vacía
			User.create({ username: 'admin', 
						  password: '1234'
						});
			User.create({ username: 'pepe', 
						  password: '5678'
						})
			.then(function() { console.log('Tabla de usuarios inicializada')});
		};
	});
});

var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res, next) {
	req.statistic = { totalQuizzes: 0, 
			           totalComments: 0, 
			           avgCommentsOfQuiz: 0.00,
			           totalQuizzesWithComments: 0,
			           totalQuizzesWithoutComments: 0 };

	// Calcular el número de preguntas
	models.Quiz.count().then(function(count){
		req.statistic.totalQuizzes = count;

		// Calcular el número de comentarios totales
		models.Comment.count().then(function(count){
			req.statistic.totalComments = count;

			// Calcular el número medio de comentarios por pregunta
			if(req.statistic.totalQuizzes !== 0){
				req.statistic.avgCommentsOfQuiz = (req.statistic.totalComments / req.statistic.totalQuizzes).toFixed(2);
			}

			// Calcular el número de preguntas con/sin comentarios
			models.Quiz.findAll({
					include: [{ model: models.Comment }]
				}).then(function(results){
				for(i in results){
					if(results[i].Comments.length){
						req.statistic.totalQuizzesWithComments++;
					} else {
						req.statistic.totalQuizzesWithoutComments++;
					}
				}
				res.render('statistics/show', { statistic: req.statistic, errors: [] });
			}).catch(function(error) { next(error); });
		}).catch(function(error) { next(error); });
	}).catch(function(error) { next(error); });
};

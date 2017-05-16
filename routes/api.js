var solver = require('../controllers/solver');

var routesAPI = function(app) {
  
  //solver routes
  app.post('/solver/solve', solver.solve);
}


module.exports = routesAPI;

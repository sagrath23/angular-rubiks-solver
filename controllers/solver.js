var solverModel = require('../models/solver');

var solver = {};
// controller that handles request to solve a rubik cube
solver.solve = function(req, res) {

  if (!req.body.state) {
    res.status(400);
    res.send({
      status: 'error',
      error: 'No rubiks cube state send.'
    });
  }

  var result = RubiksCubeSolver.prototype.solve(req.body.state);

  if (result) {
    var response = {
      result: result
    }
    res.send(response);
  } else {
    res.send({
      status: 'error',
      error: 'Error occured while solving rubiks cube.'
    });
  }
};

module.exports = solver;

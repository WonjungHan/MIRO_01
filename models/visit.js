var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var visit = new Schema({
   total: {type: String, default: 0},
   today: {type: String, default: 0},
   current: {type: String}
});

module.exports = mongoose.model('visit', visit);
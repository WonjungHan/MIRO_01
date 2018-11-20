var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
   name: String,
   id: String,
   email: String,
   phone: String,
   pw: String
});

var bcrypt = require('bcryptjs');
//비밀번호를 암호화시키는 모듈 (보안)
//npm install해서 설치해주어야한다.

User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, 8);
};//비밀번호를 암호화하겠다는 함수 

User.methods.validateHash = function(password) {
  return bcrypt.compareSync(password, this.pw);
}; //this 는 속해있는 객체를 의미 비교해서 같으면 true리턴 다르면 false 리턴
//패스워드와 입력된 패스워드가 일치하는지

module.exports = mongoose.model('user', User);
var express = require('express');
var app = express();
var ejs = require('ejs');

app.set('views', __dirname + '/public');

app.use(express.static(__dirname + '/src'));

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const mongoose = require('mongoose');
mongoose.connect('mongodb://munheejo:heejo0520@ds141623.mlab.com:41623/munheejo', { useNewUrlParser: true });

var session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'tired',
  resave: false,
  saveUninitialized: true,
}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("success");
});

var Visit = require('./models/visit');
var User = require('./models/user');

// var visit = new Visit({
//   today: 0,
//   total: 0,
//   current: dd
// })
// visit.save(function(err){
//   console.log("visit");
// })

app.get("/", function(req,res){
  Visit.findOne({_id:"5be59edb1f88964c2ce689a5"}, function(err, visit){
    var today = new Date();
    var dd = today.getDate().toString();
    console.log(dd);
    if(visit.current != dd){
      visit.today=0;
      visit.current=dd;
    }
    visit.today++;
    visit.total++;
    visit.save(function(err){
      res.render('mainpage.ejs', {visit: visit});
    })
  })
  });


  app.get('/login', function(req, res){
    res.render('login.ejs')
  })
  
  
  app.post('/login', function(req, res){
    User.findOne({id:req.body.id}, function(err, user){
      if(!user){
        console.log('wrong id!')
        res.redirect('/login')
      }else{
        if(!user.validateHash(req.body.password)){
          console.log('wrong pw!')
          res.redirect('/')
        }else{
          req.session.user = user.id;
          res.redirect('/')
        }
      }
    })
  })

 
  app.post('/signUp', function(req, res){
    User.find({id:req.body.id}, function(err, user){
      if(err) throw err;
      if(user.length > 0){
        //아이디 존재한다.
      }else{
        var user = new User({
          name: req.body.name,
          id: req.body.id,
          email: req.body.email,
          phone: req.body.phone,
          pw: req.body.password
        })
        user.pw = user.generateHash(user.pw);//암호화
        user.save(function(err){
          if(err) throw err;
          res.redirect('/login')//맨 처음 홈페이지로
        })
      }
    })
  })

  
  app.get("/about", function(req,res){
    res.render('about.ejs');
  });

  app.get("/date", function(req,res){
    res.render('component-datepicker.ejs');
  });

  app.get("/counter", function(req,res){
    res.render('counters.ejs');
  });

  app.post('/logout', function(req,res){
    req.session.destroy(function(err){
      res.redirect('/login')
    })
  })


app.listen(3000);
var express = require('express');
var mysql = require('mysql');
var expressHandlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('lab', 'root');

var Person = sequelize.define('Person', {
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  address: Sequelize.STRING

});

var PORT = process.env.NODE_ENV || 8000;

var app = express();

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function(req, res) {
  sequelize.query('SELECT * FROM People', { type: sequelize.QueryTypes.SELECT})
  .then(function(people) {
    console.log(people)
    var data = {
      peopleData: people
    }
          res.render('view',data);
  })

});

app.post('/register', function(req, res) {
  Person.create(req.body).then(function() {
    res.redirect('/');
  }).catch(function(err) {
    res.redirect('/?msg=' + err.message);
  });
});

sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("LISTNEING!");
  });
});

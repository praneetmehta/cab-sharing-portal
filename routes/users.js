var express = require('express');
var router = express.Router();
var newUser = require('../schemas/registrationSchema.js');
var Cab = require('../schemas/postsSchema.js');
var sessions = require('../schemas/sessionSchema.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/home', function(req, res) {
    if (!req.session.user) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.end(['OOOPS!! You are not authorized.. Login to view this content!!',
            '<a href="/users/login">Go to the Login Page </a>',
            'or else <a href="/users/register"> Register</a>'
        ].join(''))
    } else if (req.session.user) {
        res.render('dashboard', {
            title: req.session.user
        });
    }
});
router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/register', function(req, res) {
    res.render('register');
});

//submit registration form through POST request
router.post('/register', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    if (firstname == '' || lastname == '' || username == '' || password == '') {
        res.redirect('/users/register');
    } else {
        console.log('entered');

        var newuser = new newUser;

        newuser.firstname = firstname;
        newuser.lastname = lastname;
        newuser.username = username;
        newuser.password = password;
        newuser.save(function(err, savedObject) {
            if (err) {
                console.log(err);
                res.status(500).send();
                res.redirect('/users/login');
            } else {
                console.log('User registered');
                res.redirect('/users/login');
            };
        });
    }
});

//login request
router.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    newUser.findOne({
        username: username,
        password: password
    }, function(err, newUser) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        } else if (!newUser) {
            console.log('Invalid Username or Password');
            return res.redirect('/users/login');
        }

        if (username == 'admin' && password == 'admin') {
            return console.log('Hey admin!!');
            return res.redirect('/users/admin');
        } else {
            req.session.user = username;
            console.log(req.session.user);
            return res.redirect('/users/home');
        }
    });
});


router.get('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy();
        res.redirect('/users/login');
        console.log('true');
    } else {
        res.redirect('/users/login');
    }
});

router.get('/response', function(req, res) {
    if (req.query.query == 'post') {
        res.render('postsharing', {
            title: req.session.user
        });
    } else if (req.query.query == 'search') {
        Cab.find({}).exec(function(err, cab) {
            if (err) {
                console.log(err);
            } else {
                res.render('searchCab', {
                    newCab: cab
                });
            }
        });
    } else {
        res.redirect('/users/home');
    }
});

router.post('/createpost', function(req, res) {
    var username = req.session.user;
    var cab = req.body.cab;
    var date = req.body.date;
    var time = req.body.time;
    var space = req.body.space;
    var contact = req.body.contact;

    var date = new Date(date);
    //extract date
    var month = date.getMonth() + 1; //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();

    var newCab = new Cab;
    newCab.cab = cab;
    newCab.dateOfJourney = day + "/" + month + "/" + year;
    newCab.space = space;
    newCab.time = time;
    newCab.name = req.session.user;
    newCab.contact = contact;


    newCab.save(function(err, savedCab) {
        if (err) {
            console.log(err);
            res.redirect('/users/home');
        } else {
            console.log('Journey Registerd');
            res.redirect('/users/response?query=search');
            console.log(time);
            console.log(typeof date);
        }
    })
});

module.exports = router;

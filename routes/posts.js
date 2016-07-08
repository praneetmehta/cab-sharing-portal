var express = require('express');
var router = express.Router();

var Cab = require('../schemas/postsSchema.js');


var mongoose = require('mongoose');

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
    } else if (req.query.dateFilter && req.query.timeFilter) {
        var date = req.query.dateFilter;
        console.log(typeof date);
        console.log(date);
        var time = req.query.timeFilter;
        console.log(req.query.timeFilter);
        Cab.find({
            time: time,
            dateOfJourney: date
        }).exec(function(err, cab) {
            if (err) {
                console.log(err);
            } else {
                res.render('searchCab', {
                    newCab: cab
                });
            }
        });
    } else {
        console.log(req.query);
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
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    var newCab = new Cab;
    newCab.cab = cab;
    newCab.dateOfJourney = year + "-" + month + "-" + day;
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
            res.redirect('/cabposts/response?query=search');
            console.log(time);
            console.log(typeof newCab.dateOfJourney);
            console.log(newCab.dateOfJourney);
        }
    })
});

module.exports = router;

const express = require('express');
const mysql = require('mysql');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const router = express.Router();
const con = getConnection();

//middleware
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded( {extended: false} ));

function getConnection() {
    return mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    });
}

router.get('/messages', (req, res) => {
    console.log('Show Messages');
    res.end();
});

//get students
router.get('/students', (req, res) => {
    const queryString = "SELECT * FROM students"
    con.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for students: ' + err);
            res.sendStatus(500);
            return;
        }
        res.json(rows);
      });
});

//get student by ID
router.get('/students/:id', (req, res) => {
    const userID = req.params.id;
    con.query("SELECT * FROM students WHERE ID = ?", [userID], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for student ID: ' + err);
            res.sendStatus(500);
            return;
        }
        console.log("Student ID query successfull");
        res.json(rows);
      });
})

//create user route
router.post('/create_student', (req, res) => {
    console.log(req);
    console.log("Name: " + req.body.name);
    console.log("Course: " + req.body.course);
    console.log("Grade: " + req.body.grade);
    const studentName = req.body.name;
    const studentCourse = req.body.course;
    const studentGrade = req.body.grade;

    const queryString = "INSERT INTO students (name, course, grade) VALUES ( ?, ?, ?)";
    getConnection().query(queryString, [studentName, studentCourse, studentGrade], (err, results, fields) => {
        if (err) {
            console.log('Failed to insert new student' + err);
            res.setStatus(500);
            return
        }
        console.log('New student added to DB successfully with id: ' + results.insertId);
        res.end();
    })
});

module.exports = router;
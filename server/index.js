const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

//middleware
app.use(bodyParser.urlencoded( {extended: false} ));

//server logging
app.use(morgan('short'));

//client folder
app.use(express.static('../client'));

function getConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "node_sgt"
    });
}


const con = getConnection();

//Check server connection
con.connect(function(err) {
    if (err) {
        console.log("Failed to Connect to DB error: " + err);
        return
    } else {
        console.log("Database Connected!");
        return
    }
});

//create user route
app.post('/create_student', (req, res) => {
    console.log("Name: " + req.body.name);
    console.log("Course: " + req.body.course);
    console.log("Grade: " + req.body.grade);
    const studentId = req.body.id;
    const studentName = req.body.name;
    const studentCourse = req.body.course;
    const studentGrade = req.body.grade;

    const queryString = "INSERT INTO students (id, name, course, grade) VALUES (?, ?, ?, ?)";
    getConnection().query(queryString, [studentId, studentName, studentCourse, studentGrade], (err, results, fields) => {
        if (err) {
            console.log('Failed to insert new student' + err);
            res.setStatus(500);
            return
        }
        console.log('New student added to DB successfully with id: ' + results.insertId);
        res.end();
    })
});

//Set listining port
app.listen(7555, () => {
    console.log('Server running on http://localhost:7555')
})

//get students
app.get('/students', (req, res) => {
    const userID = req.params.id;
    con.query("SELECT * FROM students", (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for students: ' + err);
            res.sendStatus(500);
            return;
        }
        res.json(rows);
      });
})


//get student by ID
app.get('/students/:id', (req, res) => {
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


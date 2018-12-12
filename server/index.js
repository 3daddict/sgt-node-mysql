const express = require('express');
const mysql = require('mysql');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const app = express();

//use router
const router = require('./routes/students.js');
app.use(router);

//middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( {extended: false} ));

//server logging
const morgan = require('morgan');
app.use(morgan('short'));

//client folder
app.use(express.static('../client'));

function getConnection() {
    return mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database
    });
}
const con = getConnection();

//Set listining port
app.listen(config.server.port, () => {
    console.log('Server running on http://localhost:7555')
})

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

// //create user route
// app.post('/create_student', (req, res) => {
//     console.log("Name: " + req.body.name);
//     console.log("Course: " + req.body.course);
//     console.log("Grade: " + req.body.grade);
//     const studentId = req.body.id;
//     const studentName = req.body.name;
//     const studentCourse = req.body.course;
//     const studentGrade = req.body.grade;

//     const queryString = "INSERT INTO students (id, name, course, grade) VALUES (?, ?, ?, ?)";
//     getConnection().query(queryString, [studentId, studentName, studentCourse, studentGrade], (err, results, fields) => {
//         if (err) {
//             console.log('Failed to insert new student' + err);
//             res.setStatus(500);
//             return
//         }
//         console.log('New student added to DB successfully with id: ' + results.insertId);
//         res.end();
//     })
// });

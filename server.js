let express = require("express");
let cors = require("cors");
let app = express();

app.use(express.json());
app.use(cors());

const port = 2410;

app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { studentsData } = require("./studentData.js");

app.get("/svr/test",function(req, res){
    res.send("Hello World");
});

app.get("/svr/students", function (req, res) {
    let courseStr = req.query.course;
    let grade = req.query.grade;
    let sort = req.query.sort;
    let arr1 = studentsData;
    if (courseStr) {
        let courseArr = courseStr.split(",");
        arr1= arr1.filter((st) => courseArr.find((c1) => c1 === st.course));
    }

    if (grade){
        arr1 = arr1.filter((st) => st.grade === grade);
    }

    if (sort === "name") {
        arr1.sort((st1, st2) => st1.name.localeCompare(st2.name));
    }

    if (sort === "course") {
        arr1.sort((st1, st2) => st1.course.localeCompare(st2.course));
    }
    res.send(arr1);
    // res.send(studentsData);
});

app.get("/svr/students/:id", function (req, res) {
    let id = +req.params.id;
    let student = studentsData.find((st) => st.id === id);
    if(student){
        res.send(student);
    }else{
        res.status(404).send("No student found")
    }
})

app.get("/svr/students/course/:course", function(req, res){
    let course = req.params.course;
    const arr1 = studentsData.filter((st) => st.course  === course);
    res.send(arr1);
})

app.post("/svr/students", function (req, res) {
    let body = req.body;
    let maxid = studentsData.reduce(
        (acc,curr) => (curr.id >= acc ? curr.id : acc), 0
    );
    let newid = maxid + 1;
    let newStudent = { id: newid, ...body};
    studentsData.push(newStudent);
    res.send(newStudent);
})

app.put("/svr/students/:id", function (req, res) {
    let id = +req.params.id;
    let body = req.body;
    let index = studentsData.findIndex((st) => st.id === id);
    if (index>=0) {
        let updateStudent = {id: id, ...body};
        studentsData[index] = updateStudent;
        res.send(updateStudent);
    } else {
        res.status(404).send("No student found");
    }
})

app.delete("/svr/students/:id", function (req, res) {
    let id = +req.params.id;
    let index = studentsData.findIndex((st) => st.id === id);
    if( index>=0) {
        let deleteStudent = studentsData.splice(index, 1);
        res.send(deleteStudent);
    } else {
        res.status(404).send("No student found");
    }
})


//Rest APIs

//Get : requests data from the server for the specified resource 

//post : sends data to the server to create a resource

//put : used to update a resource

//Delete : used to delete a resource
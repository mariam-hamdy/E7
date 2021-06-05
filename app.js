const Joi = require('joi');
const express =  require('express') ;
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const urlencodedParser =bodyParser.urlencoded({ extended: false });
app.use(express.json());
const CourseValidation = course => {
    
    const schema = {
        name : Joi.string().min(5).required() ,
        code :Joi.string().regex(/^[a-zA-Z]{3}\d{3}$/ ).required() ,
        describe : Joi.string().max(200).allow(null , ''),

    };
    const result =Joi.validate(course , schema);
   return result ;
};

const StudentValidation = student => {
    
    const schema = {
        name : Joi.string().min(5).regex(/^[a-zA-Z ' -]+$/ ).required() ,
        code :Joi.string().min(7).max(7).required() 


    };
    const result =Joi.validate(student, schema);
   return result ;
};

let students =[
     {id: 1 , code : "1601367" , name : "mariam hamdy"},
  
];


let courses =[
    {id : 1 , name : 'lab' ,code :'CSE000' , description : ''},
  
];


app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/web/courses/create' , (req , res) => {
    res.sendFile(path.join(__dirname, '/views/addcourse.html'));
});

app.get('/web/students/create' , (req , res) => {
    res.sendFile(path.join(__dirname, '/views/addstudent.html'));
});

app.get('/api/courses', (req,res)=>{
   res.send(courses);
});

app.get('/api/courses/:id' , (req,res)=>{
   const course = courses.find(e=>e.id===parseInt(req.params.id));
   if(!course) {
    res.status(404).send('the couse with the given id was not found');
    return ;
}
   res.send(course);
 });


 app.post('/api/courses/create', urlencodedParser, (req,res)=> {
    const {error} =CourseValidation(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return ;
    }
    const course = {
        id : courses.length + 1 ,
        name : req.body.name,
        code : req.body.code ,
        description : req.body.describe
    };
    courses.push(course);
    res.send(course);
 });

 app.put('/api/courses/:id' , (req,res)=>{
    const course = courses.find(e=>e.id===parseInt(req.params.id));
    if(!course) {
        res.status(404).send('the couse with the given id was not found');
        return ;
    }

    const {error} =CourseValidation(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return ;
    }

    course.name=req.body.name ;
    course.code=req.body.code ;
    course.description= req.body.describe;
    res.send(course);

 });

 app.delete('/api/courses/:id' , (req, res)=> {
    const course = courses.find(e=>e.id===parseInt(req.params.id));
    if(!course) {
        res.status(404).send('the couse with the given id was not found');
        return ;
    }
    
    const index =courses.indexOf(course);
    courses.splice(index , 1);

    res.send(course);
 });

 
app.get('/api/students', (req,res)=>{
    res.send(students);
 });

 app.get('/api/students/:id' , (req,res)=>{
    const student = students.find(e=>e.id===parseInt(req.params.id));
    if(!student) {
     res.status(404).send('the student with the given id was not found');
     return ;
 }
    res.send(student);
  });
 

  app.post('/api/students/create', urlencodedParser, (req,res)=> {
     const {error} =StudentValidation(req.body);
     if(error) {
         res.status(400).send(error.details[0].message);
         return ;
     }
     const student = {
         id : students.length + 1 ,
         name : req.body.name,
         code : req.body.code ,
        
     };
   students.push(student);
    res.send(student);
  });


  app.put('/api/students/:id' , (req,res)=>{
     const student = students.find(e=>e.code===parseInt(req.params.id));
     if(!course) {
         res.status(404).send('the student with the given id was not found');
         return ;
     }
 
     const {error} =StudentValidation(req.body);
     if(error) {
         res.status(400).send(error.details[0].message);
         return ;
     }
     student.name=req.body.name ;
     student.code=req.body.code ;
     res.send(student);
 
  });

  app.delete('/api/students/:id' , (req, res)=> {
     const student = students.find(e=>e.id===parseInt(req.params.id));
     if(!student) {
         res.status(404).send('the student with the given id was not found');
         return ;
     }
     
     const index =students.indexOf(student);
     students.splice(index , 1);
 
     res.send(student);
  });

const port =process.env.PORT  || 3000;
app.listen(port , ()=>{
    console.log(`listening on port  ${port}....`);
});
const Joi = require('joi')
const express = require('express')
const req = require('express/lib/request')
const app = express()

app.use(express.json())

const courses = [
    {
     id: 1,
     name: 'course1'   
    },
    {
        id: 2,
        name: 'course2'   
       },
       {
        id: 3,
        name: 'course3'   
       }
]

app.get('/', (req, res)=>{
    res.send('Hello  World')
})

app.get('/api/courses', (req, res)=>{
    res.send(courses)
})

// Routers: 
/* app.get('/api/courses/:id', (req, res) => {
    res.send(req.params.id)
}) */


/* app.get('/api/courses/:year/:month', (req, res) => {
    res.send(req.params)
}) */

// For query parameters
/* app.get('/api/posts/:year/:month', (req, res) => {
    res.send(req.query) // http://localhost:5000/api/posts/2018/1?sortBy=name
}) */

app.post('/api/courses', (req, res) =>{
    /* const schema = {
        name: Joi.string().min(3).required()
    }

    const result = Joi.validate(req.body, schema)
    //console.log(result);

    //validatio logic
    if(result.error){
        // 400 Bad Request
        res.status(400).send(result.error.details[0].message)
        return;
    }  */

    const { error } = validateCourse(req.body) // result.error using destructing property
    if(error){
        res.status(400).send(error.details[0].message)
        return;
    } 


    const course = {
        id: courses.length + 1,
        name: req.body.name //In order to this line to work we need to enable parsing of json object in the body of the request: app.use(express.json())
    }
    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        res.status(404).send('The course with the given ID was not found!')
        return;
    }

    // Validate
    // If invalid, return 400 - Bad request
    //const result = validateCourse(req.body) //Using Object Destructuring we don't need this line
    const { error } = validateCourse(req.body) // result.error using destructing property

    if(error) return res.status(400).send(error.details[0].message)



    // Update course
    course.name = req.body.name
    // Return the updated course
    res.send(course)

})


app.delete('/api/courses/:id', (req, res) => {
    // Look up the course with given id
    // Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found!')

    // Delete
    const index =  courses.indexOf(course)
    courses.splice(index, 1) // To remove one object

    // Return the same course
    res.send(course)

})




function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema)

}


app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found!')
    res.send(course)
})


//Using Environment Variables: PORT
 const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log(`Listening on port ${port}...`);
})






















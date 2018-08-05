const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

var courses = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Math' }
];

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('course not found!');
    }

    res.send(course);
});

app.post('/api/courses', (req, res) => {
    //validation
    let { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //find course
    let course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('course not found!');
    }

    //validation
    let { error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    //find course
    let course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('course not found!');
    }

    //delete
    var index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(courses);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}


const port = 3000; //process.env.port || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
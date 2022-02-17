const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Blog = require('./models/blogs.js')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const dbUrl = process.env.CONNECT_KEY

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    
    res.redirect('/blogs')
})

app.get('/about', (req, res) => {

    res.render('about', {title:'About'})
})

app.get('/blogs/create', (req, res) => {

    res.render('create', {title:'Create Blogs'})
})

app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt:-1})
    .then((result) => {
        res.render('index', {title:'All blogs', blogs:result})
    })
})

app.post('/blogs', (req, res)=> {
    const blog = new Blog(req.body)
    blog.save()
    .then((result) => {
        res.redirect('/')
    })
    .catch((err) => {
        console.log(err)
    })
})

app.get('/blogs/:id', (req, res) => {

    const id = req.params.id
    Blog.findById(id)
    
    .then((result) => {
    
     res.render('details', {title:'Blog Details', blog:result})
    })
    .catch((err) => {
        console.log(err)
    })
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id
    Blog.findByIdAndDelete(id)
    .then((result) => {
        res.json({redirect:'/blogs'})
    })
    .catch((err) => {
        console.log(err)
    })
})

app.use((req, res) => {

    res.status(404).render('404', {title:'404'})
})

mongoose.connect(dbUrl, {useNewUrlParser:true, useUnifiedTopology:true})
.then((result) => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
    
})
.catch((err) => {
    console.log(err)
})
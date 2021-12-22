import express from 'express'
import ejs from 'ejs'
import mongoose from 'mongoose'
import Blog from './models/blogs'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 5000
const dbUrl = process.env.CONNECT_KEY

mongoose.connect(dbUrl, {useNewUrlParser:true, useUnifiedTopology:true})
.then((result) => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
    
})
.catch((err) => {
    console.log(err)
})

app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    
    res.redirect('/blogs')
})

app.get('/about', (req, res) => {

    res.render('about', {title:'About'})
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

app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt:-1})
    .then((result) => {
        res.render('index', {title:'All blogs', blogs:result})
    })
})

app.get('/blogs/create', (req, res) => {

    res.render('create', {title:'Create Blogs'})
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

app.use((req, res) => {

    res.status(404).render('404', {title:'404'})
})

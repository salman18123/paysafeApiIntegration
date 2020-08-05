const express=require('express')
const path=require('path')
const app=express()
const SERVER_PORT=process.env.PORT||2020
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/api',require('./api'))
app.listen(SERVER_PORT,()=>{
    console.log("started the base")
})
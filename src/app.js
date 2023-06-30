const express = require('express');
const path = require('path');

const app = express();
const publicPath = path.join(__dirname,'../public');

app.use(express.static(publicPath));

app.get('/about', (req,res)=>{
    console.log('here we are');
});

app.get('*',(req, res)=>{
    res.send('<h1 style="color: red">404: Not Found</h1>');
})

app.listen(3000, ()=>{
    console.log('Server running on Port 3000');
})
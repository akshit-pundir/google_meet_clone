const { app } = require('./server');



app.get('/test',(req,res) => {

    res.json({message:"test server up an running"})

});





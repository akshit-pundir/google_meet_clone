const { app } = require('./server');
const jwt = require("jsonwebtoken");

const linkSecret = "adasd##fase$asf5563GDS5%";


app.get('/user-link',(req,res) => {

    const apptData = {
        professionalsFullName: "Akshit Pundir, Doc ",
        apptDate: Date.now()
    };

    const token = jwt.sign(apptData,linkSecret);
    
    res.send(`https://localhost:5173/join-video?token=${token}`);

    // res.json({message:"test server up an running"})

});


app.post('/validate-link',(req,res) => {

    const { token } = req.body;

    const decodedData = jwt.verify(token,linkSecret);

    res.json(decodedData);

});







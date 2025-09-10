const { app } = require('./server');
const jwt = require("jsonwebtoken");
const linkSecret = "adasd##fase$asf5563GDS5%";

const { v4: uuidv4 } = require("uuid");

const professionalAppointments = [];

app.set('professionalAppointments',professionalAppointments);


app.get('/user-link',(req,res) => {

    const uuid = uuidv4(); // unique identifier/primary key

    const apptData = {
        professionalsFullName: "Akshit Pundir, Doc ",
        apptDate: Date.now(),
        uuid,
        clientName:"Jim Jones"
    };

    professionalAppointments.push(apptData);

    const token = jwt.sign(apptData,linkSecret);
    
    res.send(`https://localhost:5173/join-video?token=${token}`);

    // res.json({message:"test server up an running"})

});


app.post('/validate-link',(req,res) => {

    const { token } = req.body;
    const decodedData = jwt.verify(token,linkSecret);
    res.json(decodedData);

    

});



app.get('/pro-link',(req,res) => {

    const userData = {
        fullName: "Peter Chan, J.D",
        proId: 1234
    };

    const token = jwt.sign(userData,linkSecret);
    res.send(`<a  target="_blank"  href="https://localhost:5173/dashboard?token=${token}">Link Here </a>`);

})











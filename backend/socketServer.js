const { io } = require('./server');
const jwt = require("jsonwebtoken");
const { app } = require('./server');
const linkSecret = "adasd##fase$asf5563GDS5%";

const connectedProfessionals = [];



const allKnownOffers = {
    /* 
       uuid --> key
       offer
       professionalFullName
       appointement date
       offerIceCandidates
       answer
       answerIceCandidates
    */

};

io.on('connection',(socket) => {

    console.log(socket.id + "has connected");
    
    const token = socket.handshake.auth.jwt ;
    

    let decodedToken;
        try{
            decodedToken = jwt.verify(token,linkSecret)
        }catch(err){
            console.log(err);
            socket.disconnect();
            return;
        }
        
    const { fullName, proId } = decodedToken;    

    if(proId){
        const connectedPro = connectedProfessionals.find( cp => cp.proId === proId);

        if(connectedPro){
            connectedPro.socketId = socket.id;
        }else{
            connectedProfessionals.push({
                socketId:socket.id,
                fullName,
                proId    
            })
        }

      
// send the appointment data out to the professional
        const professionalAppointments = app.get('professionalAppointments');
        socket.emit('apptData',professionalAppointments.filter( pa => pa.professionalsFullName === fullName ));

        for(const key in allKnownOffers){

            if(allKnownOffers[key].professionalsFullName === fullName){

                   io.to(socket.id).emit('newOfferWaiting',allKnownOffers[key]); 
                //    console.log("offer send")
            }

        }


    }else{
        // this is a client
    }


    // console.log(connectedProfessionals);

    socket.on('newOffer',({offer,apptInfo}) => {
        
       allKnownOffers[apptInfo.uuid] = {
          ...apptInfo,
          offer,
          offererIceCandidates:[],
          answer:null,
          answerIceCandidates:[]  
       }
       
    //    console.log("offer came in ")
       
       const professionalAppointments = app.get('professionalAppointments');
       const pa = professionalAppointments.find(pa => pa.uuid === apptInfo.uuid);

       if(pa){
            pa.waiting = true;
       }

       const p = connectedProfessionals.find( cp => cp.fullName === apptInfo.professionalsFullName)
       
    //    console.log("backend connected sockets",connectedProfessionals)
    //    console.log(" appt info -->",apptInfo.professionalsFullName)

       if(p){
        const socketId = p.socketId;
        socket.to(socketId).emit('newOfferWaiting',allKnownOffers[apptInfo.uuid]);
        socket.to(socketId).emit('apptData',professionalAppointments.filter( pa => pa.professionalsFullName === apptInfo.professionalsAppointments ));

       }

    });

});










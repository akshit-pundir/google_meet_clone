const { io } = require('./server');
const jwt = require("jsonwebtoken");
const { app } = require('./server');
const linkSecret = "adasd##fase$asf5563GDS5%";

const connectedProfessionals = [];
const connectedClients = [];



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
        const { professionalsFullName, uuid, clientName } = decodedToken;   
        const clientExist = connectedClients.find(c => c.uuid == uuid);

        if(clientExist){
            clientExist.socketId = socket.id;
        
        }else{

            connectedClients.push({
                clientName,
                uuid,
                professionalMeetingWith: professionalsFullName,
                socketId:socket.id
            });
        }
        const offerForThisClient = allKnownOffers[uuid];
        if(offerForThisClient){
            io.to(socket.id).emit('answerToClient',offerForThisClient.answer);
        }   
        

    }


    socket.on('newAnswer',({answer,uuid}) => {

        const socketToSendTo = connectedClients.find( c => c.uuid == uuid);
        if(socketToSendTo){
            socket.to(socketToSendTo.socketId).emit('answerToClient',answer);
        }   

        const knownOffer = allKnownOffers[uuid];
        if(knownOffer){
            knownOffer.answer = answer;
        }
        


    });

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

    socket.on('getIce',(uuid,who,ackFunc) => {

        const offer = allKnownOffers[uuid];
        let iceCandidates = [];

        if(who === "professional"){
            iceCandidates = offer.offererIceCandidates;
           
        }else if(who === "client"){
            iceCandidates = offer.answerIceCandidates;
            
        }
        // console.log(offer);

        ackFunc(iceCandidates);

    })




    socket.on('iceToServer',({ who, iceCandidates, uuid }) => {

        const offerToUpdate = allKnownOffers[uuid];

        if(offerToUpdate){

           if(who === 'client'){
              offerToUpdate.offererIceCandidates.push(iceCandidates);
              const socketToSendTo = connectedProfessionals.find( cp => cp.fullName === decodedToken.professionalsFullName);
              
              
              if(socketToSendTo){
                  socket.to(socketToSendTo.socketId).emit('iceToClient',iceCandidates);
                }
            }else if(who === 'professional'){
              
              offerToUpdate.answerIceCandidates.push(iceCandidates);
              const socketToSendTo = connectedClients.find( cp => cp.uuid == uuid);
              
              if(socketToSendTo){
                socket.to(socketToSendTo.socketId).emit('iceToClient',iceCandidates);
               }
            }

        }

    })


});










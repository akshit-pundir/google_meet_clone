import updateCallStatus from "../redux-elements/actions/updateCallStatus";

const clientSocketListners = (socket,dispatch,addIceCandidateToPc) => {

    socket.on('answerToClient',answer => {

        console.log("answer from client listner",answer);
        dispatch(updateCallStatus('answer',answer));
        dispatch(updateCallStatus('myRole','offerer'));
    });


    socket.on('iceToClient',iceC => {
        console.log("ice from client ss listnere",iceC);
        addIceCandidateToPc(iceC)
    })




}

export default  clientSocketListners;
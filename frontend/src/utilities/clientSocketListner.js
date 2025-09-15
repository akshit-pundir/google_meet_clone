import updateCallStatus from "../redux-elements/actions/updateCallStatus";

const clientSocketListners = (socket,dispatch) => {

    socket.on('answerToClient',answer => {

        console.log("answer from client listner",answer);
        dispatch(updateCallStatus('answer',answer));
        dispatch(updateCallStatus('myRole','offerer'));
    });







}

export default  clientSocketListners;
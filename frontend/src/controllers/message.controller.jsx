export const newMessageSender = async (
    socket, sender,
    setAvailableChats,
    receiver, type, message = "",
) => {
    if (!receiver) {
        return console.log("reciever is not present")
    }
    if (!socket) {
        console.log("socket not available")
        return;
    }

    if (socket.readyState === WebSocket.OPEN) {
        try {
            
            const date = new Date("2025-06-30T12:42:23.000Z");
            const createdAt = date.toString().split(' GMT')[0];
            await socket.send(JSON.stringify(
                {
                    sender: sender,
                    receiver: receiver,
                    message: message,
                    createdAt: createdAt,
                    type: type
                }
            ))
            if (type === "message") {
                // setAvailableChats((array)=>([...array,message]))
                const chatDiv = document.getElementById("chats-div")
                if(chatDiv.textContent==="No chats there"){
                    chatDiv.textContent = ""
                    chatDiv.style.justifyContent = "end"
                }

                const chat = document.createElement("div");
                
                const mainChatText = document.createElement("div")

                mainChatText.textContent = message

                chat.appendChild(mainChatText)

                const chatTextStatus = document.createElement("div")



                const loading = document.createElement("div");
                loading.classList.add("loading-spinner");


                chatTextStatus.appendChild(loading)



                // chatTextStatus.textContent = `${createdAt}`

                chat.appendChild(chatTextStatus)
                chat.classList.add("newly-unupdated-chats")
                chat.style.alignSelf = "flex-end"

                chatDiv.appendChild(chat)

                chatDiv.scrollTo(
                    {
                        top: chatDiv.scrollHeight,
                        behavior: "smooth"
                    }
                )

            }
            // statusLog.current.textContent = "sent successfully"
        } catch (error) {
            console.log("some error is:", error)
            // statusLog.current.textContent = "sent failed"
        }
    } else {
        // statusLog.current.textContent = "sent failed receiver is offline"
        console.log("sent failed receivevkcr is offline")
    }

}


export const newQueriesSender = async (

    socket, sender,
    type, queryMsg = "", receiver = ""
) => {

    if (!socket) {
        console.error("socket not available")
        return;
    }
    if (!sender || !type || !queryMsg) {
        return console.error("some params missing")
    }

    if (socket.readyState === WebSocket.OPEN) {
        try {

            await socket.send(JSON.stringify(
                {
                    sender: sender,
                    receiver: receiver,
                    query: queryMsg,
                    type: type
                }
            ))

            // statusLog.current.textContent = "sent successfully"
        } catch (error) {
            console.error("some error is:", error)
            // statusLog.current.textContent = "sent failed"
        }
    } else {
        // statusLog.current.textContent = "sent failed receiver is offline"
        console.error("sent failed receivevkcr is offline")
    }

}

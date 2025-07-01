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

                chatDiv.insertAdjacentHTML(
                    "beforeend"
                    ,
                    `
                    <div style= "
                        
                            border: 0.5px solid black;
                            align-self: self-end
                        "
                    >
                        <div class="main-chat-text">
                            ${message}
                        </div>
                        <div class="chatTextStatus newly-unupdated-chats">
                            . ${createdAt}
                        </div>
                    </div>
                    `
                )
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

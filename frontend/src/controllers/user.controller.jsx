
export const newConnectionHandlerAndComingMessages = async (
    socketContainer,
    username, age,

    setUser,
    selectedRecieverRef,
    setAvailableUsers,
    setAvailableChats,
    signInErrLog,
    setShowLoading,
    { timerIntervalId, timerTimeoutId }

) => {

    if (!socketContainer.current) {
        console.error("WebSocket is not present");
        return;
    } else {
        console.log("websocket is present")
    }



    socketContainer.current.onopen = () => {

    }

    socketContainer.current.onmessage = (e) => {

        try {
            const data = JSON.parse(e.data)

            if (data.type === "register") {

                // signInErrLog.current.style.visibility = "hidden"
                clearInterval(timerIntervalId)
                clearTimeout(timerTimeoutId)

                setShowLoading(false)


                setAvailableUsers(data.availableUsers)
                setUser(data.username)


            }
            else if (data.type === "message") {

                if (data.sender === username) {

                    if (data.status === "failed") {

                        const chatsDiv = document.getElementById("chats-div")
                        const unUpdatedChats = chatsDiv.querySelectorAll(".newly-unupdated-chats")

                        for (let i = 0; i < unUpdatedChats.length; i++) {
                            unUpdatedChats[i].children[1].textContent = `❌ ${data.createdAt}`;
                            unUpdatedChats[i].classList.remove("newly-unupdated-chats")

                        }
                        return
                    } else if (data.status === "success") {
                        console.log("updating to sucess wait")
                        const chatsDiv = document.getElementById("chats-div")
                        const unUpdatedChats = chatsDiv.querySelectorAll(".newly-unupdated-chats")
                        console.log(unUpdatedChats)

                        for (let i = 0; i < unUpdatedChats.length; i++) {
                            unUpdatedChats[i].children[1].textContent = `✔ ${data.createdAt}`;
                            unUpdatedChats[i].classList.remove("newly-unupdated-chats")
                        }
                        return
                    }
                    else {
                        console.error("some errro neigther failer nor success")
                        return
                    }
                }

                else if (data.sender === selectedRecieverRef.current) {

                    const chatsDiv = document.getElementById("chats-div")
                    if (chatsDiv.children[0].textContent === "No chats there") {
                        chatsDiv.textContent = ""
                        // chatsDiv.style.justifyContent = "start"
                    }

                    const child = document.createElement("div")
                    child.style.border = "0.5px solid black";
                    child.style.alignSelf = "flex-start";
                    child.innerHTML = `<div class="main-chat-text">${data.msg}</div><div class="chatTextStatus">${data.createdAt} ${data.createdAt}</div>`
                    chatsDiv.appendChild(child)


                    chatsDiv.scrollTo(
                        {
                            top: chatsDiv.scrollHeight,
                            behavior: "smooth"
                        }
                    )
                    return
                }
                else {
                    console.error("some error its neigher for sender nor for reciver")
                    return
                }






            }
            else if (data.type === "query-message") {
                if (data.query === "refresh-all-user") {
                    // const usersDiv = document.getElementById("users-div")
                    // if (data.msg.length && usersDiv){

                    // }

                    // if (usersDiv.textContent === "No users there") {
                    //     usersDiv.textContent = ""
                    //     usersDiv.style.justifyContent = "start"
                    // }
                    setAvailableUsers(data.msg)

                }
                return
            }
            else if (data.type === "chatlistdemand") {


                setAvailableChats(data.msg)










            }
            else {
                console.log("neighter register not message type")

            }
        } catch (error) {
            console.log("error in socket onmessage", error)

        }
    }

    socketContainer.current.onclose = async (e) => {
        clearInterval(timerIntervalId)
        clearTimeout(timerTimeoutId)
        setShowLoading(false)
        signInErrLog.current.textContent = e.reason
        signInErrLog.current.style.color = "red"
        signInErrLog.current.style.fontWeight = "bold"





    }



}




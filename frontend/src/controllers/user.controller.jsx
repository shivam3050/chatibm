
export const newConnectionHandlerAndComingMessages = async (
    username, age,

    setUser,
    selectedRecieverRef,
    setAvailableUsers,
    setAvailableChats,
    signInErrLog

) => {
    try {
        const socket = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}/?username=${username}&age=${age}`)

        socket.onopen = () => {


        }


        socket.onmessage = (e) => {


            try {
                const data = JSON.parse(e.data)


                if (data.type === "register") {


                    setAvailableUsers(data.availableUsers)

                    setUser(data.username)



                }
                else if (data.type === "message") {


                    if (data.sender === username) {

                        if (data.status === "failed") {

                            const chatsDiv = document.getElementById("chats-div")
                            const unUpdatedChats = chatsDiv.querySelectorAll(".newly-unupdated-chats")

                            for (let i = 0; i < unUpdatedChats.length; i++) {
                                unUpdatedChats[i].textContent = `❌ ${data.createdAt}`;
                                unUpdatedChats[i].classList.remove("newly-unupdated-chats")

                            }
                            return
                        } else if (data.status === "success") {
                            console.log("updating to sucess wait")
                            const chatsDiv = document.getElementById("chats-div")
                            const unUpdatedChats = chatsDiv.querySelectorAll(".newly-unupdated-chats")

                            for (let i = 0; i < unUpdatedChats.length; i++) {
                                unUpdatedChats[i].textContent = `✔ ${data.createdAt}`;
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

        socket.onclose = async (e) => {
            signInErrLog.current.textContent = e.reason
            signInErrLog.current.style.visibility = "visible"
            await new Promise((resolve) => {
                setTimeout(() => {
                    signInErrLog.current.classList.add("fade-out")
                    resolve()
                }, 3000)
            })
            await new Promise((resolve)=>{
                setTimeout(()=>{
                    signInErrLog.current.style.visibility = "hidden"
                    signInErrLog.current.classList.remove("fade-out")
                    resolve()
                },400)
            })

        }


        return socket

    } catch (error) {
        console.error(error)

        return null
    }
}




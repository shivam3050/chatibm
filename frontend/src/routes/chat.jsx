import { useState } from "react";
import { useEffect } from "react";


export const ChatSection = (props) => {

    const [availableChatsInUI, setAvailableChatsInUI] = useState([])

    useEffect(() => {

        setAvailableChatsInUI(props.chatRef.current.availableChats)

        const chatDiv = document.getElementById("chats-div")

        chatDiv?.scrollTo({ top: chatDiv?.scrollHeight, behavior: 'smooth' })

    }, [props.refreshChatsFlag])

    if (!props.chatRef.current || props.chatRef.current.availableChats.length === 0) {
        
        return (<div id="chats-div" className="" style={{
            display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center"

        }}>
            <div className="any-label" style={{
                borderRadius: "calc(10*var(--med-border-radius))",
                textAlign: "center"
            }}>
                No chats there
            </div>
        </div>)
    }

    else {
        return <div id="chats-div" >
            {
                availableChatsInUI.map((item, index) => {   //  senderId: data.sender.id, receiverId: data.receiver.id, content: data.msg, createdAt: data.createdAt
                    let originalDate = new Date(item.createdAt)
                    let timeDiff = new Date() - originalDate; // in milliseconds  
                    let timeText;

                    console.log(item.senderId ,"::" ,props.userRef.current.id)

                    if (timeDiff < 60 * 1000) {
                        // timeText = `${Math.floor(timeDiff / 1000)} seconds`;
                        timeText = originalDate.toLocaleTimeString();
                    } else if (timeDiff < 60 * 60 * 1000) {
                        // timeText = `${Math.floor(timeDiff / (60 * 1000))} minutes`;
                        timeText = originalDate.toLocaleTimeString();
                    } else if (timeDiff < 24 * 60 * 60 * 1000) {
                        // timeText = `${Math.floor(timeDiff / (60 * 60 * 1000))} hours`;
                        timeText = originalDate.toLocaleTimeString();
                    } else {
                        timeText = originalDate;
                    }

                    return (
                        <div style={
                            {

                                alignSelf: (item.senderId === props.userRef.current.id) ? ("flex-end") : ("flex-start")
                            }
                        } key={index}>

                            <div className="main-chat-text">

                                {item.content}

                            </div>

                            <div className="chatTextStatus">

                                {(item.senderId === props.userRef.current.id) ? (`✔ ${timeText}`) : (timeText)}
                            </div>

                        </div>
                    )
                })
            }
        </div>
    }
}

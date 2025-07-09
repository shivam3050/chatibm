import { useLayoutEffect, useState } from "react";
import { useEffect } from "react";


export const ChatSection = (props) => {

    const [availableChatsInUI, setAvailableChatsInUI] = useState([])

    useEffect(() => {

        setAvailableChatsInUI(props.chatRef.current.availableChats)

    }, [props.refreshChatsFlag])

        useLayoutEffect(() => {
        const chatDiv = props.chatsDivRef.current//document.getElementById("chats-div");
        chatDiv?.scrollTo({
            top: chatDiv.scrollHeight,
            behavior: "smooth"
        });
    }, [availableChatsInUI]);

    // if (!props.chatRef.current || props.chatRef.current.availableChats.length === 0) {
        
    //     return (<div id="chats-div" className="" style={{
    //         display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center"

    //     }}>
    //         <div className="any-label" style={{
    //             borderRadius: "calc(10*var(--med-border-radius))",
    //             textAlign: "center"
    //         }}>
    //             No chats there
    //         </div>
    //     </div>)
    // }

    // else {
        return <div id="chats-div" ref={props.chatsDivRef}>
            {
                availableChatsInUI.map((item, index) => {   //  senderId: data.sender.id, receiverId: data.receiver.id, content: data.msg, createdAt: data.createdAt
                    let originalDate = new Date(item.createdAt)
                    let timeDiff = new Date() - originalDate; // in milliseconds  
                    let timeText;


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

                            <pre className="main-chat-text">

                                {item.content}

                            </pre>

                            <div className="chatTextStatus">

                                {(item.senderId === props.userRef.current.id) ? (`✔ ${timeText}`) : (timeText)}
                            </div>

                        </div>
                    )
                })
            }
        </div>
    // }
}

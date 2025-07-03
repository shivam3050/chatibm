import { useEffect } from "react";


export const ChatSection = (props) => {

    useEffect(() => {
        const chatDiv = document.getElementById("chats-div")
        chatDiv?.scrollTo({ top: chatDiv?.scrollHeight, behavior: 'smooth' })
    }, [props.availableChats])

    if (!props.availableChats || props.availableChats.length === 0) {
        return (<div id="chats-div" className="" style={{ display: "flex", flexDirection:"column", justifyContent: "start", alignItems: "center" }}>
            <div className="any-label">
                No chats there
            </div>
        </div>)
    }

    else {
        return <div id="chats-div" >
            {
                props.availableChats.map((item, index) => {

                    return (<div style={
                        {

                            alignSelf: (item.sender !== props.username) ? ("flex-start") : ("flex-end")
                        }
                    } key={index}>
                        <div className="main-chat-text">
                            {item.content}
                        </div>
                        <div className="chatTextStatus">
                            {(item.sender === props.username) ? (`✔ ${item.createdAt}`) : (`${item.createdAt}`)}
                        </div>
                    </div>)
                })
            }
        </div>
    }
}

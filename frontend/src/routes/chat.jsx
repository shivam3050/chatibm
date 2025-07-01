import { useEffect } from "react";

export const ChatSection = (props) => {
    useEffect(()=>{
        const chatDiv = document.getElementById("chats-div")
        chatDiv?.scrollTo({ top: chatDiv?.scrollHeight, behavior: 'smooth' })
    },[props.availableChats])
    if (!props.availableChats || props.availableChats.length === 0) {
        return (<div id="chats-div" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>No chats there</div>)
    }
    else {
        return <div id="chats-div" >
            {
                props.availableChats.map((item, index) => {
                   
                    return (<div style={
                        {
                            border:"0.5px solid black",
                            alignSelf: (item.sender !== props.username)?("self-start"):("self-end")
                        }
                    } key={index}>
                        <div className="main-chat-text">
                            {item.content}
                        </div>
                        <div className="chatTextStatus">
                           {(item.sender === props.username)?(`✔  ${item.createdAt}`):(`${item.createdAt}`)}
                        </div>
                    </div>)
                })
            }
        </div>
    }
}

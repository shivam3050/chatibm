import { useEffect } from "react";
import { useState } from "react";
import { useRef} from "react";
import { newConnectionHandlerAndComingMessages } from "../controllers/user.controller";
import { newMessageSender, newQueriesSender } from "../controllers/message.controller";

import { UserSection } from "./userSection";
import { ChatSection } from "./chat";

export function Home() {
    console.log("main function called")
    const [user, setUser] = useState("")
    const signInErrLog = useRef()
    const socketContainer = useRef([])
    const [availableUsers, setAvailableUsers] = useState([])
    const [availableChats, setAvailableChats] = useState([])
    const [selectedReciever, setSelectedReciever] = useState("")
    const selectedRecieverRef = useRef("");
    const [user_vs_chat_flag, setUser_vs_chat_flag] = useState(true)





    async function handleManualLogin(e) {
        const formData = new FormData(e.target);
        const username = formData.get("username")
        const age = formData.get("age")

        const socketLocal = await newConnectionHandlerAndComingMessages(
            username, age,
            setUser,
            selectedRecieverRef,
            setAvailableUsers,
            setAvailableChats,
            signInErrLog
        )

        if (!socketLocal) {
            return
        }
        socketContainer.current = socketLocal
        return
    }

    async function newMessageSendHandler(e) {
        const formData = new FormData(e.target);
        const message = formData.get("message")
        await newMessageSender(socketContainer.current, user,setAvailableChats,selectedRecieverRef.current, "message", message)
    }


    const handleUserClickOnUserSection = async (receiver) => {
        setSelectedReciever(receiver)
        setUser_vs_chat_flag(false)
        await newMessageSender(
            socketContainer.current, user,
            setAvailableChats,
            receiver,
            "chatlistdemand"
        )

    };


    useEffect(()=>{
        selectedRecieverRef.current = selectedReciever
    },[selectedReciever])







    return (

        user ? (
            <div className="home dashboard">
                
                    <p>
                        <button onClick={
                            () => { setUser_vs_chat_flag(true) ; setAvailableChats([]) }}>
                            ←</button>

                        
                        <button onClick={
                            () => { newQueriesSender(socketContainer.current, user, "query-message", "refresh-all-user") }}>
                            ↻</button>

                    </p>
                    {user_vs_chat_flag ? (
                        <aside className="">
                            <UserSection 
                              
                                availableUsers={availableUsers}
                                onUserClick={handleUserClickOnUserSection}
                            />
                        </aside>

                    ) : (
                        <aside className="user-vs-chat-container">
                            <ChatSection username={user} availableChats={availableChats} />
                            <form className="formCreateChat" action="" method="post" onSubmit={(e) => {
                                e.preventDefault();
                                newMessageSendHandler(e)
                            }}>
                                <textarea required style={{resize:"none"}} placeholder={`send to ${selectedReciever}...`} name="message" maxLength="500"></textarea>
                                {/* <input required type="text" name="message" placeholder={`send to ${selectedReciever}...`} /> */}
                                <input type="submit" value="➤" />
                            </form>
                        </aside>

                    )}


                </div>
                
            
        ) : (

            <div className="home container-sign-in">

                <div className="back-overlay">
                    <div className="rotator">

                    </div>
                </div>
                <section className="signin-box">
                    <label >Choose Username</label>
                    <form action="" className="inputs" onSubmit={(e) => {
                        e.preventDefault();
                        handleManualLogin(e)
                    }}>
                        <input required type="text" name="username" placeholder="Enter username" />
                        <input required type="number" name="age" placeholder="Enter age" />
                        <label style={{ fontSize: "10px" }} ref={signInErrLog}></label>
                        <input type="submit" value="Submit" />
                        <label ref={signInErrLog}></label>
                    </form>
                </section>
            </div>
        )




    );
}
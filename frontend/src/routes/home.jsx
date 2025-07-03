import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { newConnectionHandlerAndComingMessages } from "../controllers/user.controller";
import { newMessageSender, newQueriesSender } from "../controllers/message.controller";

import { UserSection } from "./userSection";
import { ChatSection } from "./chat";
import Loading from "../utilitiesCompo/loading";

export function Home() {

    useEffect(() => {
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVh(); // initial run
  window.addEventListener('resize', setVh);

  return () => window.removeEventListener('resize', setVh);
}, []);






    console.log("main function called")
    const [user, setUser] = useState("")
    const signInErrLog = useRef("")
    const [showLoading, setShowLoading] = useState(false)
    const socketContainer = useRef(null)
    const [availableUsers, setAvailableUsers] = useState([])
    const [availableChats, setAvailableChats] = useState([])
    const [selectedReciever, setSelectedReciever] = useState("")
    const selectedRecieverRef = useRef("");

    const [user_vs_chat_flag, setUser_vs_chat_flag] = useState(true)






    async function handleManualLogin(e) {

        const formData = new FormData(e.target);
        const username = formData.get("username")
        const age = formData.get("age")



        socketContainer.current = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}/?username=${username}&age=${age}`)

        if (!socketContainer.current) {
            return
        }
        signInErrLog.current.textContent = ""
        let i = 50
        const timerIntervalId = setInterval(() => {
            signInErrLog.current.textContent = i
            i--
        }, 1000)

        const timerTimeoutId = setTimeout(() => {
            clearInterval(timerIntervalId)
            signInErrLog.current.textContent = ""
        }, 50000)

        signInErrLog.current.style.color = "white"
        signInErrLog.current.style.fontWeight = "100"
        setShowLoading(true)
        await newConnectionHandlerAndComingMessages(
            // const socketLocal = await newConnectionHandlerAndComingMessages(
            socketContainer,
            username, age,
            setUser,
            selectedRecieverRef,
            setAvailableUsers,
            setAvailableChats,
            signInErrLog,
            setShowLoading,
            { timerIntervalId: timerIntervalId, timerTimeoutId: timerTimeoutId }
        )



        return
    }

    async function newMessageSendHandler(e) {
        const formData = new FormData(e.target);
        const message = formData.get("message")
        await newMessageSender(socketContainer.current, user, setAvailableChats, selectedRecieverRef.current, "message", message)
        const textarea = e.target.querySelector('[name="message"]')
        textarea.value = ""
        textarea.focus()
       
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


    useEffect(() => {
        selectedRecieverRef.current = selectedReciever
    }, [selectedReciever])







    return (

        user ? (
            <div className="home dashboard">

                <p>
                    <button onClick={
                        () => { setSelectedReciever("");setUser_vs_chat_flag(true); setAvailableChats([]) }}>
                        ←</button>

                        <div>{selectedReciever}</div>
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
                            <textarea required

                                style={{ resize: "none" }} placeholder={`send to ${selectedReciever}...`} name="message" maxLength="500"></textarea>
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
                    <form autoComplete="off" action="" className="inputs" onSubmit={async (e) => {
                        e.preventDefault();

                        await handleManualLogin(e)                    }}>
                        <input required type="text" name="username" placeholder="Enter username" />
                        <input required type="number" name="age" placeholder="Enter age" />


                        <input type="submit" name="submitbtn" disabled={showLoading} value="Submit" style={{ backgroundColor: showLoading ? ("red") : ("green") }} />







                        <label 
                        style={{
                             display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--max-margin)",
                             transition: showLoading ? "none" : "opacity 8s ease",
                             opacity: showLoading ? 1 : 0,
                              }}
                               className={`${showLoading ? ("visible") : ("fade-out")}`} name="loading" >

                            <div style={{ display: showLoading ? "flex" : "none", alignItems: "center" }}>
                                <Loading size="30px"  />
                            </div>
                            <div ref={signInErrLog}>

                            </div>
                        </label>
                    </form>
                </section>
            </div>
        )




    );
}
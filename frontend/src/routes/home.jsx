import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { newConnectionHandlerAndComingMessages } from "../controllers/user.controller";
import { newMessageSender, newQueriesSender } from "../controllers/message.controller";

import { UserSection } from "./userSection";
import { ChatSection } from "./chat";
import Loading from "../utilitiesCompo/loading";

export function Home() {

    // useEffect(() => {



    //     const setVh = () => {
    //         const vh = window.innerHeight * 0.01;
    //         document.documentElement.style.setProperty('--vh', `${vh}px`);
    //     };

    //     setVh(); // initial run
    //     window.addEventListener('resize', setVh);

    //     return () => window.removeEventListener('resize', setVh);
    // }, []);






    console.log("main function called")
    const [user, setUser] = useState("")
    const signInErrLog = useRef("")
    const [showLoading, setShowLoading] = useState(false)
    const socketContainer = useRef(null)
    const [availableUsers, setAvailableUsers] = useState([])
    const [availableChats, setAvailableChats] = useState([])
    const [selectedReciever, setSelectedReciever] = useState("")

    const selectedRecieverRef = useRef("");
    const [toggleSelect, setToggleSelect] = useState(false)

    const [user_vs_chat_flag, setUser_vs_chat_flag] = useState(true)






    async function handleManualLogin(e) {

        const formData = new FormData(e.target);
        const username = formData.get("username")
        const age = formData.get("age")


        try {
            socketContainer.current = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}/?username=${username}&age=${age}`)
        } catch (error) {

        }
        if (!socketContainer.current) {
            alert("5")
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


    const toggleSelectCallback =
        (e) => {
            e.stopPropagation()
            setToggleSelect(true)

        }

    const controlUserCallback = (e) => {
        e.stopPropagation();

        if (e.target.value === "refresh") {

            newQueriesSender(socketContainer.current, user, "query-message", "refresh-all-user")
        }
        setToggleSelect(false)
        if (e.target.value === "logout") {
            socketContainer.current.close()
            setUser(null)
        }
    }


    useEffect(() => {
        selectedRecieverRef.current = selectedReciever
    }, [selectedReciever])







    return (

        user ? (
            <div className="home dashboard" >

                <header >
                    <button
                        style={{ visibility: selectedReciever ? "visible" : "hidden", backgroundColor: "transparent" }} onClick={
                            () => { setSelectedReciever(""); setUser_vs_chat_flag(true); setAvailableChats([]) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg></button>

                    <div style={{
                        fontFamily: "cursive",
                        color: "var(--professional-blue)",
                        fontWeight: "bold",
                        fontSize: "18px",
                        textDecoration: "underline"
                    }}
                    ><i>{selectedReciever}</i></div>

                    <section

                        onClick={(e) => { toggleSelectCallback(e) }} id="controls"
                        className="button"
                        style={{ visibility: selectedReciever ? "hidden" : "visible" }}

                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-list" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </div>


                        <aside style={{
                            right: toggleSelect ? "0" : "-100vw",


                        }}>
                            <button onClick={(e) => { controlUserCallback(e) }} className="option" value="close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                            </button>
                            <button onClick={(e) => { controlUserCallback(e) }} className="option" value="username"
                                style={{
                                    fontFamily: "cursive",
                                    color: "var(--professional-blue)",
                                    fontWeight: "bold",
                                    fontSize: "18px",
                                    textDecoration: "underline"
                                }}><i>{user}</i></button>
                            <button onClick={(e) => { controlUserCallback(e) }} className="option" value="refresh" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: '10px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                                </svg>Users
                            </button>
                            <button onClick={(e) => { controlUserCallback(e) }} className="option" value="logout" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: '10px', color: "red" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                                    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                                </svg> Logout
                            </button>
                        </aside>


                    </section>

                </header>

                {user_vs_chat_flag ? (
                    <div>
                        <UserSection

                            availableUsers={availableUsers}
                            onUserClick={handleUserClickOnUserSection}
                        />
                    </div>

                ) : (
                    <aside className="user-vs-chat-container">
                        <ChatSection username={user} availableChats={availableChats} />
                        <form className="formCreateChat" action="" method="post" onSubmit={(e) => {
                            e.preventDefault();
                            newMessageSendHandler(e)
                        }}>
                            <div>
                                <textarea required alignItems="center"

                                    style={{ resize: "none" }} placeholder={`Send to ${selectedReciever}...`} name="message" maxLength="500">

                                </textarea>
                            </div>
                            <div>
                                <button type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </aside>

                )}

                {/* <div style={
                    {

                        left: toggleSelect ? "0" : "-100vw",
                        position:"absolute",
                        backgroundColor:"red",
                        opacity:"1"
                    }
                } className="dashboard-overlay"
                    onClick={(e) => {
                        e.stopPropagation()
                        setToggleSelect(false)
                    }}
                >

                </div> */}

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

                        await handleManualLogin(e)
                    }}>
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
                                <Loading size="30px" />
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
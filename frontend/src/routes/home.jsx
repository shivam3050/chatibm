
import { useState } from "react";

import Loading from "../utilitiesCompo/loading";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useRef } from "react";


export function Home(props) {
    // states to update only ui and none
    const [selectedReceiver, setSelectedReceiver] = useState("")

    const [headerTitle, setHeaderTitle] = useState("ChatIBM")

    const [toggleSelect, setToggleSelect] = useState(false)

    const inboxIconRef = useRef(null)

    const [signInLoadingFlag, setSignInLoadingFlag] = useState(false)

    const [signInErrorLog, setSignInErrorLog] = useState("")






    const navigate = useNavigate()










    const initializeConnection = async (
        e,
        socketContainer,
        user,
        setUser,
        userRef,
        chatRef
    ) => {

        e.preventDefault()

        setSignInLoadingFlag(true)


        const formData = new FormData(e.currentTarget);
        const username = formData.get("username")
        const age = formData.get("age")
        const label = e.currentTarget.lastElementChild;

        //prechecking about correctness of data
        label.style.visibility = "visible"

        for (let i = 0; i < username.length; i++) {

            if (username[i] === ' ') {

                setSignInLoadingFlag(false)
                setSignInErrorLog("no spaces allowed in username")

                return
            }
        }






        try {
            socketContainer.current = new WebSocket(`${import.meta.env.VITE_BACKEND_WS_URL}/?username=${username}&age=${age}`)
        } catch (error) {

            setSignInLoadingFlag(false)
            setSignInErrorLog("unknown error")
            console.error(error)
            return
        }

        socketContainer.current.onopen = () => {

            console.log("socket is ready to connect")
        }

        socketContainer.current.onclose = (event) => {
            console.error(event.reason)
            setSignInLoadingFlag(false)
            setSignInErrorLog(event.reason)
            return
        }
        socketContainer.current.onerror = (event) => {
            console.error(event.reason)
            setSignInLoadingFlag(false)
            setSignInErrorLog(event.reason)
            return
        }

        socketContainer.current.onmessage = (message) => {
            setSignInLoadingFlag(false)
            setSignInErrorLog("")
            let data = null
            try {
                data = JSON.parse(message.data)
            } catch (error) {
                console.error(error)
                return
            }

            if (data.type === "register") {
                console.log(data.type)
                console.log(data)

                setUser(data.username)

                userRef.current = {

                    username: data.username,

                    age: data.age,

                    id: data.id,

                    availableUsers: data.availableUsers || [],

                    availableConnectedUsers: []
                }
                return
            }

            if (data.type === "query-message") {

                if (data.query === "refresh-all-user") {
                    console.log(data.type)
                    console.log(data.query)
                    console.log(data)

                    userRef.current.availableUsers = data.msg

                    if (userRef.current.availableUsers) {
                        props.setRefreshUsersFlag(prev => prev + 1)
                        navigate("/users")
                        setHeaderTitle("ChatIBM")

                    }

                    return
                }
                if (data.query === "chat-list-demand") {
                    console.log(data.type)
                    console.log(data.query)
                    console.log(data)

                    if (data.status === "failed") {

                        props.setChatsOverlay(true)

                        navigate("/chats")

                        setHeaderTitle("")
                        
                        console.log("navigated to chats")
                        return
                    }
                    //below is for success

                    chatRef.current = {

                        sender: data.sender,

                        receiver: data.receiver,

                        availableChats: data.msg

                    }

                    if (chatRef.current) {

                        setSelectedReceiver(chatRef.current.receiver.username)

                        props.setRefreshChatsFlag(prev => prev + 1)

                        navigate("/chats")

                        return
                    }

                    return
                }
                console.error("invalid query but valid type in the respnse")
                return
            }

            if (data.type === "message") {
                console.log(data.type)
                console.log(data)

                if (data.sender.id === userRef.current.id) {

                    if (data.status === "failed") {

                        console.error("your msg has been failed", data.msg)

                        const chatsDiv = document.getElementById("chats-div")


                        const pendingChatFields = chatsDiv.querySelectorAll(".newly-unupdated-chats")

                        for (let i = 0; i < pendingChatFields.length; i++) {

                            pendingChatFields[i].children[1].textContent = `❌`

                            pendingChatFields[i].classList.remove("newly-unupdated-chats")
                        }

                        return
                    }


                    console.log("your msg sent successfully via server")


                    // checks if receiver already in my contacts or not
                    if (!(userRef.current.availableConnectedUsers.some((obj) => (obj.id === data.receiver.id)))) {
                        // this is means not present
                        userRef.current.availableConnectedUsers.push(
                            {

                                username: data.receiver.username,
                                age: data.receiver.age,
                                id: data.receiver.id

                            }
                        )

                    }



                    const chatsDiv = document.getElementById("chats-div")


                    const pendingChatFields = chatsDiv.querySelectorAll(".newly-unupdated-chats")

                    for (let i = 0; i < pendingChatFields.length; i++) {

                        pendingChatFields[i].children[1].textContent = `✔ ${data.createdAt}`

                        pendingChatFields[i].classList.remove("newly-unupdated-chats")

                    }



                    return
                }

                if (data.sender.id === chatRef.current?.receiver?.id) {
                    // THIS IS THE PART WHERE RECEIVER IS FOCUSED
                    console.log("THIS IS THE PART WHERE RECEIVER IS FOCUSED")

                    if (data.status === "failed") {
                        console.error("recieved failed msg by a sender to me")
                        return
                    }

                    // chatRef.current.availableChats.push({
                    //     senderId: data.sender.id, receiverId: data.receiver.id, content: data.msg, createdAt: data.createdAt
                    // })






                    const chatsDiv = document.getElementById("chats-div")

                    const chatField = document.createElement("div")

                    chatField.style.alignSelf = "flex-start"

                    const chatTextField = document.createElement("div")

                    const chatStatusField = document.createElement("div")

                    chatTextField.textContent = data.msg

                    chatStatusField.textContent = `${data.createdAt}`

                    chatField.appendChild(chatTextField)

                    chatField.appendChild(chatStatusField)

                    chatsDiv.appendChild(chatField)

                    chatField.scrollIntoView({ behavior: "smooth", block: "start" })






                    return
                }


                if (data.receiver && data.sender.id !== chatRef.current?.receiver?.id) {

                    // THIS IS THE CONDITION WHERE RECEIVER IS NOT FOCUSED BUT MESSAGE CAME FROM HIM
                    console.log("THIS IS THE CONDITION WHERE RECEIVER IS NOT FOCUSED BUT MESSAGE CAME FROM HIM")
                    console.log("yes1")

                    // checks if receiver already in my contacts or not
                    if (!(userRef.current.availableConnectedUsers.some((obj) => (obj.id === data.sender.id)))) {
                        // this is means not present
                        userRef.current.availableConnectedUsers.push(
                            {

                                username: data.sender.username,
                                age: data.sender.age,
                                id: data.sender.id

                            }
                        )
                        console.log("loggin userref for debug :: ", userRef.current)

                    }
                    console.log("yes2")

                    if (!inboxIconRef.current.classList.contains("svg-container-inbox-icon")) {

                        inboxIconRef.current.classList.add("svg-container-inbox-icon")
                        console.log("yes3")

                    }
                    return
                }




                return
            }

            console.log("invalid data type in response")
            return

        }
    }












    const controlUserCallback = (e) => {




        setToggleSelect(false)
        setTimeout(() => {

            console.log(toggleSelect)
        }, 3000)

        if (e.target.value === "close") {
            return
        }
        if (e.target.value === "refresh") {
            console.log("we will refresh the users")

            if (!props.socketContainer.current || props.socketContainer.current.readyState !== 1) {

                console.error("socket is not ready")


                return
            }

            props.socketContainer.current.send(
                JSON.stringify(
                    {
                        type: "query-message",
                        queryType: "refresh-all-user",
                        sender: { username: props.userRef.current.username, id: props.userRef.current.id }
                    }
                )
            )


            return
        }
        if (e.target.value === "logout") {
            console.log("we will logout later")

            return
        }

        return

    }




    return (

        props.user ? (
            <div className="home dashboard" >

                <header className=" header"

                >
                    <div
                        style={{ visibility: (selectedReceiver || headerTitle !== "ChatIBM") ? "visible" : "hidden", backgroundColor: "transparent" }}
                        onClick={
                            () => {
                                setSelectedReceiver("");
                                props.chatRef.current.availableChats = []
                                props.chatRef.current.receiver = ""
                                navigate("/users")
                                setHeaderTitle("ChatIBM")
                            }
                        }
                        className="button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </div>

                    <div style={{
                        fontFamily: "cursive",
                        color: "var(--professional-blue)",
                        fontWeight: "bold",
                        // fontSize: "18px",
                        // textDecoration: "underline",
                        textShadow: "1px 1px 1px var(--dark-black)"
                    }}

                    ><i className={selectedReceiver ? "selected-username-holder" : ""}>{selectedReceiver || headerTitle}</i></div>


                    <div className="inbox"
                        ref={inboxIconRef}

                        onClick={
                            (e) => {

                                setSelectedReceiver("");

                                if (props.chatRef.current && props.chatRef.current.availableChats) {

                                    props.chatRef.current.availableChats = []
                                }

                                navigate("/mycontacts-and-notifications")
                                setHeaderTitle("Recent Connections")

                                e.currentTarget.classList.remove("svg-container-inbox-icon")

                            }
                        }
                    >

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                        </svg>

                    </div>



                    <section

                        onClick={
                            () => {

                                setToggleSelect(true)

                            }
                        }
                        id="controls"
                        className="button"
                        style={{ visibility: selectedReceiver ? "hidden" : "visible" }}

                    >
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-list" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </div>


                        <aside style={{
                            right: toggleSelect ? "calc(var(--max-padding))" : "calc(-2 * var(--toggle-select-width))",


                        }}>
                            <button onClick={
                                (e) => { e.stopPropagation(); controlUserCallback(e) }
                            } className="option" value="close">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                            </button>
                            <button onClick={
                                (e) => { e.stopPropagation(); controlUserCallback(e) }
                            } className="option " value="username"
                                style={{
                                    fontFamily: "cursive",
                                    color: "var(--professional-blue)",
                                    fontWeight: "bold",
                                    fontSize: "18px",
                                    textDecoration: "underline",

                                }}
                            ><i className="selected-username-holder-noborder">{props.userRef.current.username}</i></button>
                            <button onClick={
                                (e) => { e.stopPropagation(); controlUserCallback(e) }
                            } className="option" value="refresh" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: '10px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                                </svg>Sync users
                            </button>
                            <button onClick={
                                (e) => { e.stopPropagation(); controlUserCallback(e) }
                            } className="option" value="logout" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: '10px', color: "red" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                                    <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
                                </svg> Logout
                            </button>
                        </aside>


                    </section>

                </header>




                <Outlet />






                <section className="dashboard-overlay"
                    style={
                        {
                            display: toggleSelect ? "block" : "none"
                        }
                    }
                    onClick={() => {
                        setToggleSelect(false)
                    }}>

                </section>
            </div>


        ) : (

            <div className="home container-sign-in">


                <section className="signin-box">
                    <label >Choose Username</label>
                    <form autoComplete="off" action="" className="inputs" onSubmit={async (e) => {

                        await initializeConnection(
                            e,
                            props.socketContainer,
                            props.user,
                            props.setUser,
                            props.userRef,
                            props.chatRef
                        )

                    }}>

                        <fieldset>

                            <legend>Username</legend>
                            <input required type="text" name="username" />

                        </fieldset>

                        <fieldset>

                            <input required spellCheck={false} type="number" name="age" />

                            <legend>Age</legend>

                        </fieldset>

                        <input type="submit" spellCheck={false} name="submitbtn" value="Submit" style={{ backgroundColor: "green" }} />

                        <label
                            style={
                                {
                                    visibility: "hidden"
                                }
                            }>

                            {signInLoadingFlag ? (<Loading size="16px" />) : (signInErrorLog)}


                        </label>





                    </form>
                </section>
            </div>
        )




    );
}
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"


export const MyRecentContactSection = (props) => {




    const [updateAvailableConnectedUsersInUI, setUpdateAvailableConnectedUsersUsersInUI] = useState([])

    useEffect(()=>{
        if(props.userRef.current.availableConnectedUsers){
            setUpdateAvailableConnectedUsersUsersInUI(props.userRef.current.availableConnectedUsers)
        }
     
            return 
       

    },[props.refreshUsersFlag])



        if (!props.userRef || !props.userRef.current.availableConnectedUsers || props.userRef.current.availableConnectedUsers.length === 0) {
            return (<div className="any-label"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                No recent connections
    
            </div>)
        } 



        return <div className="users-container">
            {
                updateAvailableConnectedUsersInUI.map((user, index) => {
                    return (
                        <div
                            onClick={
                                async () => {
                                   
                                    if(!props.socketContainer?.current || props.socketContainer.current.readyState!==1){
                                        return console.error("socket is not ready")
                                    }

//                                     {
//   sender: { username: 'dfvf', id: '17518942509320' },
//   receiver: { username: 'dfvf', id: '17518942509320' },
//   type: 'query-message',
//   queryType: 'chat-list-demand'
// }
// this is the issue both sender and reciever
                                    console.log(
                                            {
                                                sender:{username: props.userRef.current.username, id: props.userRef.current.id},
                                                receiver:{username: user.username, id: user.id},
                                                type:"query-message",
                                                queryType:"chat-list-demand"
                                            }
                                    )

                                    props.socketContainer.current.send(
                                        JSON.stringify(
                                            {
                                                sender:{username: props.userRef.current.username, id: props.userRef.current.id},
                                                receiver:{username: user.username, id: user.id},
                                                type:"query-message",
                                                queryType:"chat-list-demand"
                                            }
                                        )
                                    )
                                    
                                }
                            }
                            key={index}>
                            <div>

                            </div>
                            <div
                            >
                                <div>
                                    {user.username}
                                </div>
                                <div>
                                    {`Age ${user.age} yrs`}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    
}
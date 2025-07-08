import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"


export const UserSection = (props) => {




    const [updateAvailableUsersInUI, setUpdateAvailableUsersInUI] = useState([])

    useEffect(()=>{
        if(props.userRef.current.availableUsers){
            setUpdateAvailableUsersInUI(props.userRef.current.availableUsers)
        }
     
            return 
       

    },[props.refreshGlobalUsersFlag])



        if (!props.userRef || !props.userRef.current.availableUsers || props.userRef.current.availableUsers.length === 0) {
            return (<div className="any-label"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                No users active
    
            </div>)
        } 



        return <div className="users-container">
            {
                updateAvailableUsersInUI.map((user, index) => {
                    return (
                        <div
                            onClick={
                                async () => {
                                   
                                    if(!props.socketContainer?.current || props.socketContainer.current.readyState!==1){
                                        return console.error("socket is not ready")
                                    }

                                    props.socketContainer.current.send(
                                        JSON.stringify(
                                            {
                                                sender:{username: props.userRef.current.username, id: props.userRef.current.id, age: props.userRef.current.age},
                                                receiver:{username: user.username, id: user.id, age: user.age},
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
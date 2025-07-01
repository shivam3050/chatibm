export const UserSection = (props) => {
   
    
    if (!props.availableUsers || props.availableUsers.length === 0) {
        return (<div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>No users there</div>)
    }
    else {
        return <div className="users-container">
            {
                props.availableUsers.map(({username,age}, index) => {
                    return (<div
                        onClick={
                            ()=>{
                                props.onUserClick(username)
                            }
                        } key={index}>
                            <div>
                                {username}
                            </div>
                            <div>
                                {`Age ${age} yrs`}
                            </div>
                        </div>)
                })
            }
        </div>
    }
}
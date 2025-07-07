import { MyRecentContactSection } from "./myContactSection"



function AllContactsAndNotifications(props) {
  
    return (
        <div>
            <MyRecentContactSection

                userRef={props.userRef}
                socketContainer={props.socketContainer}
                refreshUsersFlag={props.refreshUsersFlag}
                
            />

        </div>

    )
}

export default AllContactsAndNotifications

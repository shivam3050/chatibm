import { UserSection } from "./userSection"


function AllUsers(props) {
  
    return (
        <div>
            <UserSection
                userRef={props.userRef}
                socketContainer={props.socketContainer}
                refreshUsersFlag={props.refreshUsersFlag}
            />

        </div>

    )
}

export default AllUsers

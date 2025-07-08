import { UserSection } from "./userSection"


function AllUsers(props) {
  
    return (
        <div>
            <UserSection
                userRef={props.userRef}
                socketContainer={props.socketContainer}
                refreshGlobalUsersFlag={props.refreshGlobalUsersFlag}

            />

        </div>

    )
}

export default AllUsers

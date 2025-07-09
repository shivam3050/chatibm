export const userRef = {

    username: "",
    id: "",
    age: null,
    gender: "",
    availableConnectedUsers: [
        {
            username: "",
            id: "",
            age: null,
            gender: ""
        }
    ],
    availableUsers: [
        {
            username: "",
            id: "",
            age: null,
            gender: ""
        }
    ],
    focusedContact: {

        username: "",
        id: "",
        age: null,
        gender: ""

    }

}


export const chatsRef = {
    sender: {
        username: "",
        id: "",
        age: null,
        gender: "",
    },
    receiver: {
        username: "",
        id: "",
        age: null,
        gender: "",
    },
    availableChats: [
        {
            senderId: "",
            receiverId: "",
            content: "",
            createdAt: ""
        }
    ]
}

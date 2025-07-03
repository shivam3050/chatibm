
import { Message } from "../db/message.model.js"
import { WebSocketServer } from 'ws';
import { parse } from "url"

export const createNewOneChat = async (sender, receiver, message, createdAt) => {
    try {
        const user = await Message.create({
            sender: sender,
            receiver: receiver,
            content: message,
            createdAt: createdAt
        })
        return user
    } catch {

        return null
    }
}

export const getChatList = async (sender, receiver) => {
    try {
        const messages = await Message.find(
            {
                $or: [
                    {
                        sender: sender, receiver: receiver
                    },
                    {
                        sender: receiver, receiver: sender
                    }
                ]
            },
            { sender: 1, receiver: 1, content: 1, createdAt: 1, _id: 0 }
        ).sort({ createdAt: 1 })


        return messages
    } catch (error) {
        console.log(error)
        return null
    }
}

export const deleteUserAllChats = async (username) => {
    try {
        await Message.deleteMany(
            {
                $or: [
                    {
                        sender: username
                    },
                    {
                        receiver: username
                    }
                ]
            })


        return true
    } catch (error) {
        console.log(error)
        return false
    }
}















const activeClients = new Map()
export const newConnectionHandler = (dbname) => {
    const host = process.env.WS_HOST
    const port = process.env.WS_PORT
    const server = new WebSocketServer(
        {
            host: host,
            port: port,
            verifyClient: (info, done) => {
                const origin = info.origin;

                if (origin === process.env.FRONTEND_URL) { // http or https prot
                    console.log(origin)
                    done(true); 
                } else {
                    console.log('Connection rejected from origin:', origin);
                    done(false, 403, 'Forbidden');
                }
            }
        }
    );
    if (server) {
        console.log(`ws is running on ${host} ${port}`)
    }
    server.on("connection", async (socket, request) => {
        console.log("connected")


        const { query } = parse(request.url, true)
        const username = query.username

        const age = parseInt(query.age)

        if (age < 18) {
            socket.close(1008, "age is less then 18")
            return
        }
        const user = activeClients.has(username)

        if (user) {
            socket.close(1008, "a user already exists")
            return
        }

        const availableUsers = [...activeClients.entries()].map(([username, data], _, __) => ({ username, age: data.age }))
        activeClients.set(username, {
            currentSocket: socket,
            age: age
        });

        socket.send(JSON.stringify(
            {
                username: username,
                type: "register",
                age: age,

                availableUsers: availableUsers

            }
        ))

        socket.on("message", async (message) => {
            let data = null
            try {
                data = await JSON.parse(message);

            } catch (error) {
                console.log(error)
            }
            const sender = data?.sender
            const receiver = data?.receiver
            const type = data?.type



            if (!type) {
                return console.error("type is not availbale")
            }
            if (type === "chatlistdemand") {
                if (!sender || !receiver) {
                    return console.error("sender or recievr not provided")
                }

                socket.send(
                    JSON.stringify({
                        status: "success",
                        sender: sender,
                        reciever: receiver,
                        type: type,
                        msg: await getChatList(sender, receiver)
                    })
                )
                return
            }
            else if (type === "message") {

                const createdAt = data.createdAt

                const userObject = activeClients.get(receiver)
                if (!userObject) {

                    return socket.send(JSON.stringify(
                        {
                            status: "failed",
                            sender: sender,
                            receiver: receiver,
                            type: "message",
                            createdAt: createdAt,
                            msg: "no receiver available"
                        }
                    ))
                }
                const { currentSocket } = userObject
                if (!currentSocket || currentSocket.readyState !== 1) {


                    return socket.send(JSON.stringify(
                        {
                            status: "failed",
                            sender: sender,
                            receiver: receiver,
                            type: "message",
                            createdAt: createdAt,
                            msg: "no receiver available"
                        }
                    ))
                }



                const result = await createNewOneChat(sender, receiver, data.message, createdAt)
                if (!result) {
                    return socket.send(
                        JSON.stringify({
                            status: "failed",
                            sender: sender,
                            receiver: receiver,
                            type: "message",
                            createdAt: createdAt,
                            msg: data.message
                        })
                    )
                }



                currentSocket.send(
                    JSON.stringify({
                        status: "success",
                        sender: sender,
                        receiver: receiver,
                        type: "message",
                        createdAt: createdAt,
                        msg: data.message
                    })
                )
                socket.send(
                    JSON.stringify({
                        status: "success",
                        sender: sender,
                        receiver: receiver,
                        createdAt: createdAt,
                        type: "message",
                    })
                )

                return


            }

            else if (type === "query-message") {
                socket.send(
                    JSON.stringify({
                        status: "success",
                        sender: sender,
                        receiver: receiver,
                        type: "query-message",
                        query: "refresh-all-user",
                        msg: [...activeClients.entries()].map(([username, itsValue], _, __) => ({ username, age: itsValue.age })).filter((item, _, __) => (item.username !== sender))
                        // msg: await searchAllUsers()
                    })
                )
                return
            }
            else {
                return console.log("dont have any valid type")
            }




        });











        socket.on("close", async () => {
            console.log("Client disconnected");
            socket.close(1000, "logout you out")
            await deleteUserAllChats(username)
            activeClients.delete(username)
            return

        });

        socket.on("error", async (error) => {
            console.error("WebSocket error:", error);

            socket.close(1011, "logged you out due to some error")
            await deleteUserAllChats(username)
            activeClients.delete(username)
            return
        });
    });

    server.on("error", (error) => {
        console.error("WebSocket server error:", error);
        activeClients = null;
        return
    });
}
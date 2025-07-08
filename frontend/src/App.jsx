import './App.css'
import AllContactsAndNotifications from './routes/AllNotification';
import AllUsers from './routes/AllUsers';
import ChatsRoute from './routes/ChatsRoute';
import { Home } from './routes/home'
import { useEffect, useRef, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";










function App() {

  const socketContainer = useRef(null)

  const [user, setUser] = useState(null)

  const userRef = useRef(null)

  const chatRef = useRef(null)


  const [refreshUsersFlag, setRefreshUsersFlag] = useState(0)

  const [refreshChatsFlag, setRefreshChatsFlag] = useState(0)

  const [chatsOverlay, setChatsOverlay ] = useState("")






















  const updateViewportVars = () => {
    const vh = window.visualViewport?.height || window.innerHeight;
    const vw = window.visualViewport?.width || window.innerWidth;
    document.documentElement.style.setProperty('--app-height', `${vh}px`);
    document.documentElement.style.setProperty('--app-width', `${vw}px`);
  }
  window.addEventListener("resize", () => {

    updateViewportVars()
  })
  useEffect(() => {
    updateViewportVars()
  }, [])

  useEffect(() => {

    fetch(import.meta.env.VITE_BACKEND_URL);

  }, [])

  return (

    <Router>
      <Routes>

        <Route path="/" element={<Home

          socketContainer={socketContainer}

          user={user}

          setUser={setUser}

          userRef={userRef}

          chatRef={chatRef}

          setRefreshUsersFlag={setRefreshUsersFlag}

          setRefreshChatsFlag={setRefreshChatsFlag}

          setChatsOverlay={setChatsOverlay}




        />}>
          <Route index element={<AllUsers

            userRef={userRef}

            socketContainer={socketContainer}

            refreshUsersFlag={refreshUsersFlag}

            

          />} />
          <Route

            path="users"

            element={
        
                <AllUsers

                  userRef={userRef}

                  socketContainer={socketContainer}

                  refreshUsersFlag={refreshUsersFlag}
                />
             
            }
          />
          <Route

            path="chats"

            element={
              
              <ChatsRoute
              
              chatRef={chatRef}
              
              socketContainer={socketContainer}
              
              userRef={userRef}
              
              refreshChatsFlag={refreshChatsFlag}

              chatsOverlay={chatsOverlay}
              />
              
            }
          />
            <Route
  
              path="mycontacts-and-notifications"
  
              element={
          
                  <AllContactsAndNotifications
  
                    userRef={userRef}
  
                    socketContainer={socketContainer}

                    refreshUsersFlag={refreshUsersFlag}
  
                    
                  />
               
              }
            />

          
        </Route>

      </Routes>
    </Router>

  )
}

export default App

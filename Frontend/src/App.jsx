
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import MyContext  from "./Mycontext.jsx";
import './App.css'
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";


function App() {
  const [prompt,setPrompt]=useState("");
  const [reply,setReply]=useState(null);
  const [currentThreadId,setThreadId]=useState(uuidv1());
  const [prevChat,setprevChat]=useState([]);
  const [newChat,setnewChat]=useState(true);
  const [latestReply,setlatestReply]=useState(null);
  const [allThreads,setallThreads]=useState([]);
  const [isOpen,setisOpen]=useState(true);
  const providerValues = {
    // your context values here
    prompt,setPrompt,
    reply,setReply,
    currentThreadId,setThreadId,
    prevChat,setprevChat,
    newChat,setnewChat,
    latestReply,setlatestReply,
    allThreads,setallThreads,
    isOpen,setisOpen,
  };
  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
      <Sidebar></Sidebar>
      <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default App

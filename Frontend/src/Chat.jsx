import "./Chat.css"
import { useState, useContext, useEffect } from "react";
import MyContext from './Mycontext.jsx'
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";
function Chat() {
    const { newChat, prevChat, reply } = useContext(MyContext);
    const [latestReply, setlatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setlatestReply(null);
            return;
        }
        if (!prevChat?.length) return;
        const content = reply.split(" ");
        let idx = 0;
        const interval = setInterval(() => {
            setlatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= content.length) clearInterval(interval);
        }, 40);
        return () => clearInterval(interval);
    }, [prevChat, reply]);
    return (
        <>
            {newChat && <h1>What would you like to discover?</h1>}
            <div className="chats">
                {
                    prevChat?.map((chat, idx) =>
                        <div className={chat.role === "user" ? "userDiv" : "geminiDiv"} key={idx}>
                            {
                                chat.role === "user" ?
                                    <p className="userMessage">{chat.content} </p> :
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }
                {
                    prevChat.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="geminiDiv" key={"non-typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChat[prevChat.length - 1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="geminiDiv" key={"typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )
                            }
                        </>
                    )
                }
                {/* {
                    prevChat.length > 0 && latestReply !== null &&
                    <div className="geminiDiv" key={"typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                    </div>
                }
                {
                    prevChat.length > 0 && latestReply === null &&
                    <div className="geminiDiv" key={"non-typing"}>
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChat[prevChat.length - 1].content}</ReactMarkdown>
                    </div>
                } */}
                {/*  <div className="userDiv">
               <p className="userMessage">User message</p>
            </div>
            <div className="geminiDiv">
                <p className="geminiMessage">Gemini message</p>
                
            </div> */}
            </div>

        </>
    )
}
export default Chat;
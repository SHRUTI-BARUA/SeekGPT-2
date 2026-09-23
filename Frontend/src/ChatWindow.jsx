import "./ChatWindow.css"
import Chat from "./Chat"
import MyContext from "./Mycontext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currentThreadId, prevChat, setprevChat, setnewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [isOpen, setisOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleProfile = () => {
        setisOpen(!isOpen);
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const getReply = async () => {
        setLoading(true);
        const imageBase64 = imageFile ? await fileToBase64(imageFile) : null;
        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: prompt,
                threadId: currentThreadId,
                imageBase64,
            }),
        };
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/chat`, options);
            const res = await response.json();
            console.log(res);
            if (res.reply) {
                setReply(res.reply);
                setImageFile(null);
            } else {
                setError("Got an empty reply. Check the ai-service logs.");
            }
        } catch (err) {
            console.log(err);
            setError("Request failed: " + err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setprevChat(prevChat => [
                ...prevChat,
                { role: "user", content: prompt },
                { role: "model", content: reply }
            ]);
        }
        setPrompt("");
    }, [reply]);

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>SeekGPT<i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIcon" onClick={handleProfile}>
                    <span><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropdownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropdownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropdownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out </div>
                </div>
            }
            <Chat></Chat>
            {loading && <p style={{textAlign:"center",color:"#aaa",fontSize:"13px"}}>⏳ Thinking… (this may take 5–10 seconds)</p>}
            <ScaleLoader color='#fff' loading={loading}></ScaleLoader>
            {error && <p style={{textAlign:"center",color:"#f55",fontSize:"13px"}}>⚠️ {error}</p>}
            <div className="chatInput">
                <div className="inputBox">
                    <label htmlFor="image-upload" title="Upload image" style={{ cursor: "pointer", padding: "0 8px", opacity: imageFile ? 1 : 0.5 }}>
                        <i className="fa-solid fa-image"></i>
                        {imageFile && <span style={{ fontSize: "11px", marginLeft: "4px" }}>{imageFile.name}</span>}
                    </label>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <br />
                <p className="info">
                    SeekGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}
export default ChatWindow;
/* import express from "express";
import Thread from "../models/Thread.js";
const router=express.Router();
import getResponse from "../utils/openai.js"
router.post("/test",async(req,res)=>{
    try{
        const thread=new Thread({
            threadId:"xyz",
            title:"testing"
        });
        const response=await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to save"});
    }
});
router.get("/thread",async(req,res)=>{
  try{
    const thread=await Thread.find({}).sort({updatedAt: -1});
    res.json(thread);
  }catch(err){
    console.log(err);
    res.status(500).json({
  error: "Failed to fetch thread",
    });
  }
  
});

router.get("/thread/:threadId",async(req,res)=>{
    const { threadId}=req.params;
    try{
        const thread=await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error:"Thread not found!!"});
        }
        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch thread"});
    }
});


router.delete("/thread/:threadId",async(req,res)=>{
    const { threadId}=req.params;
    try{
        const thread=await Thread.findOneAndDelete({threadId});
        if(!thread){
            res.status(404).json({error:"Thread not found!!"});
        }
        res.status(200).json({sucess:"Thread Deleted"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch thread"});
    }
});

router.post("/chat",async(req,res)=>{
    const {threadId,message}=req.body;
    if(!threadId || !message){
        return res.status(404).json({error:"Missing required field"});

    }
    try{
        let thread=await Thread.findOne({threadId});
        if(!thread){
            thread=new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}]

            });
        }else{
            thread.messages.push({role:"user",content:message});
        }
        const replly=await getResponse(message);
        thread.messages.push({role:"model",content:replly});
        thread.updatedAt=new Date();
        await thread.save();
        res.json({reply:replly});


    }catch(err){
        console.log(err);
        res.status(500).json({error:"Something went wrong"});
    }
})
export default router; */
import express from "express";
import Thread from "../models/Thread.js";
const router = express.Router();
import getResponse from "../utils/openai.js";

router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "testing"
        });
        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to save" });
    }
});

router.get("/thread", async (req, res) => {
    try {
        const thread = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(thread);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Failed to fetch thread",
        });
    }
});

router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId });
        if (!thread) {
            res.status(404).json({ error: "Thread not found!!" });
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
});

router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOneAndDelete({ threadId });
        if (!thread) {
            res.status(404).json({ error: "Thread not found!!" });
        }
        res.status(200).json({ sucess: "Thread Deleted" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch thread" });
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message, imageBase64 } = req.body;
    if (!threadId || !message) {
        return res.status(404).json({ error: "Missing required field" });
    }
    try {
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // build history from every message BEFORE the one we just pushed,
        // so the AI service actually has conversation memory
        const history = thread.messages.slice(0, -1).map((m) => ({
            role: m.role === "model" ? "model" : "user",
            content: m.content,
        }));

        const reply = await getResponse(message, history, imageBase64);
        thread.messages.push({ role: "model", content: reply });
        thread.updatedAt = new Date();
        await thread.save();
        res.json({ reply: reply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;
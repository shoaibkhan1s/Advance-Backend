import e from "express";
import dotenv from "dotenv"
import connectDB from "./lib/db.js";
import User from "./models/user.model.js";
import Redis from "ioredis"
import { get } from "mongoose";

dotenv.config()
const app = e()

const port = process.env.PORT || 5000
app.use(e.json())
const redis = new Redis(process.env.REDIS_URL)

app.post('/create', async (req, res) => {
    try {

        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        await redis.del("user:all")
        const user = await User.create({
            name, email, password
        })
        return res.status(200).json({ message: "User created successfully" })
    } catch (e) {
        console.log('Error in /create route', e)
    }
})


app.get('/get', async (req, res) => {
    try {

        const users = await User.find({});
        console.log(users)

        return res.status(200).json(users)
    } catch (e) {
        console.log('Error in /get route', e)
    }
})


app.get('/get-with-redis', async (req, res) => {
    try {
        const cached = await redis.get("user:all")

        if (cached) {
            console.log("cached worked")
            return res.status(200).json(JSON.parse(cached))
        }

        const users = await User.find({});
        await redis.set("user:all", JSON.stringify(users))
        return res.status(200).json(users)
    } catch (e) {
        console.log('Error in /get route', e)
    }
})


app.post("/send-otp",async (req,res) => {
    const {email} = req.body
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await redis.set(`otp:${email}`, otp,"EX",60)

    return res.json(otp)
})

app.post("/verify-otp",async (req,res)=>{
        const {email,otp} = req.body
        const cachedOtp = await redis.get(`otp:${email}`)

        if(!cachedOtp){
            return res.json({message: "Otp has been expired"})
        }
        if(otp!=cachedOtp){
            return res.status(400).json({message : "otp is wrong"})
        }

        await redis.del(`otp:${email}`)
        return res.status(200).json({message: "Otp verified successfully"})

})

app.listen(port, () => {
    connectDB()
    console.log(`Server listening on port ${port}`)
})
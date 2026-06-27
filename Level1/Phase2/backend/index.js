import express from "express";
import dotenv from "dotenv"
dotenv.config();

const app = express()
const port = process.env.PORT || 5000
app.get('/',(req,res)=>{
    res.json("server created")
})

app.listen(port, "0.0.0.0", () => {
  console.log(`server started at ${port}`);
});
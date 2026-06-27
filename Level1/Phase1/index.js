import express from "express";

const app = express();

const port = process.env.PORT || 5000

app.get('/',(req,res)=>{
    return res.json("server created").status(200);
})

app.listen(port,()=>{
    console.log(`server started at ${port}`);
})
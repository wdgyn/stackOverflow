import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import requestLogger from "./middleware/requireLogger.js";
import requireAuth from "./middleware/requireAuth.js";

import authRouter from "./routers/auth.js";
import userRouter from "./routers/users.js";
import questionRouter from "./routers/questions.js";
import answerRouter from "./routers/answers.js";
import searchRouter from "./routers/search.js";

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json({ limit: "100mb" }));//for the purpose of parsing request body 
app.use(express.urlencoded({ extended: true, limit: "100mb" }));


app.use("/api/auth", authRouter)
app.use("/api/users", userRouter);
app.use("/api/questions", questionRouter);
app.use("/api/answers", requireAuth, answerRouter);
app.use("/api/search", searchRouter);



app.get("/", (req,res)=> {
    res.send("TIGER IS FAST AF BOII");
});

app.listen(process.env.PORT,() =>  {
    // console.log(`Server running on port ${process.env.PORT}`);
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
});


// (Set on 12April - 4am+)
// To do context:
// Finished the backend le(did some codes for vote but still not too sure, think need do frontend, then after can decide the direction for vote. Also, vote related codes haven't test in postman yet.). 
// Got the questions to display properly. Find out about the react infinite loop, and ask chatgpt to implement filtering based on the filter prop next?




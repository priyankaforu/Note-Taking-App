import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import notesRoutes from "./routes/notesRoutes.js"
import { connectDB } from './config/db.js';
import ratelimiter from './middleware/ratelimiter.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



// Body Parser middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(ratelimiter);

// app.use((req,res,next) => {
//   console.log(`Req method : ${req.method} and Req URL : ${req.url}`);
//   next();
// });


app.use("/api/notes", notesRoutes);

// Once DB connected, then only goahead and listen
connectDB().then(()=>{
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});



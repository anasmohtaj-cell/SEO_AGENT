import express from "express";
import crawlRoutes from "@/routes/crawlRoutes"
const app = express();
app.use(express.json());
app.use(crawlRoutes);
const PORT = 3000;
app.listen(PORT , () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});
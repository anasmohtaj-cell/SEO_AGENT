import express from "express";

import crawlRoutes from "@/routes/crawlRoutes"
import technicalRoutes from "@/routes/technicalRoutes"

const app = express();

app.use(express.json());

app.use(crawlRoutes);
app.use(technicalRoutes);

const PORT = 3000;

app.listen(PORT , () =>{
    console.log(`Server running on http://localhost:${PORT}`);
});
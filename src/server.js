import dotenv from "dotenv";
import app from "./app/app.js";

dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
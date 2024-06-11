const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const setupSwagger = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes); 

setupSwagger(app);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


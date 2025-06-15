// Import routes
const bankingRoutes = require("./routes/banking");

// Register routes
app.use("/api/banking", bankingRoutes);

const express = require('express');
const app = express();
var cors = require('cors');
const { connectDB } = require('./database/connection');

const UserRoutes = require('./routes/UserRoutes')
const InvestorRoutes = require('./routes/InvestorRoutes')
const LandlordRoutes = require('./routes/LandlordRoutes')
const ServicesRoute = require('./routes/ServicesRoute')
const SiteRoutes = require('./routes/SiteRoutes')

require('dotenv').config()

app.use(cors(), express.json({ limit: '50mb' }))

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
      console.log(req.path, req.method);
      next();
});

app.get('/health', (req, res) => {
      res.status(200).json({
            status: true,
            message: "OK"
      })
})

app.use("/api/user", UserRoutes) // User API
app.use("/api/investor", InvestorRoutes) // Investor API
app.use("/api/landlord", LandlordRoutes) // Landlord API
app.use("/api/services", ServicesRoute) // services API
app.use("/api/site", SiteRoutes) // services API

connectDB()

app.listen(port, () => {
      console.log(`MongoDB connected and backend is running on port ${port}!`);
});
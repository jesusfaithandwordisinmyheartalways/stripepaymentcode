


// Step 1: Import necessary packages
const express = require("express");  // Import Express
const { resolve } = require("path");  // Used to handle file paths
const dotenv = require("dotenv");  // For loading environment variables from .env file
const stripe = require("stripe");  // Stripe library for payments
const cors = require("cors");





// Step 2: Initialize Express and load environment variables from the .env file
const app = express();
dotenv.config();  // Load the .env file (make sure you have it)
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Add this line to parse incoming JSON





// Step 3: Initialize Stripe with your secret key (from .env)
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Step 4: Serve static files from the 'client' directory
app.use(express.static(process.env.STATIC_DIR));  // Serves static files like HTML, CSS, JS from the client folder

// Step 5: Root endpoint (home page) that serves index.html
app.get("/", (req, res) => {
  // Resolve the file path to the index.html in the static folder
  const pathToFile = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(pathToFile);  // Send the index.html file to the client
});

// Step 6: Config endpoint that sends the Stripe public key to the client
app.get("/config", (req, res) => {
  // Send the Stripe publishable key to the client
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});



// Step 7: Create Payment Intent endpoint to handle payments
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // Extract the amount from the client request

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).send({ error: { message: "Invalid amount" } });
    }

    // Create a payment intent for the given amount in USD (amount in cents, so multiply by 100)
    const paymentIntent = await stripeInstance.paymentIntents.create({
      currency: "usd",  // Currency for the payment
      amount: amount * 100,  // Convert the amount to cents
      automatic_payment_methods: { enabled: true },  // Enable automatic payment methods (cards)
    });

    // Send back the client secret for the payment
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // If an error occurs, send a bad request with the error message
    res.status(400).send({
      error: {
        message: error.message,  // Send the error message to the client
      },
    });
  }
});





// Step 8: Start the server and listen on the defined port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});





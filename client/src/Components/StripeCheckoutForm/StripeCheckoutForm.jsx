



import React from 'react'
import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";



const StripeCheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!stripe || !elements) {
          return; // Ensure Stripe has loaded before processing
        }
    
        setIsProcessing(true);
    
        try {
          const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
              return_url: `${window.location.origin}/completion`,
            },
          });
    
          if (error) {
            setMessage(error.message || "An unexpected error occurred.");
          }
        } catch (err) {
          setMessage("Something went wrong.");
        }
    
        setIsProcessing(false);
      };



  return (
   <>


<form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? "Processing..." : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>




   </>
  )
}





export default StripeCheckoutForm

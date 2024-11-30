import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPaymentDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (sessionId) {
        try {
          const response = await axios.post(
            "http://localhost:5000/get-payment-details",
            { sessionId }
          );
          setPaymentDetails(response.data);
        } catch (error) {
          console.error("Error fetching payment details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    getPaymentDetails();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading payment details...</p>
      ) : paymentDetails ? (
        <div>
          <h1>Payment Successful</h1>
          <p>Payment ID: {paymentDetails.paymentIntentId}</p>
          <p>Amount Paid: {paymentDetails.amountPaid} INR</p>
        </div>
      ) : (
        <p>Payment failed or session ID not found.</p>
      )}
    </div>
  );
};

export default PaymentSuccess;

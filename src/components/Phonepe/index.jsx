import React, { useState } from "react";
import axios from "axios";
import { config } from "../../api/config";
// import phonepe from "../../image/phonepe.png";

const Phonepe = () => {
  const [loading2, setLoading2] = useState(false);

  const data = {
    name: "Waleed",
    amount: 1,
    number: "7498608775",
    MUID: "MUID" + Date.now(),
    transactionId: "T" + Date.now(),
  };

  // const handlePayment = async (e) => {
  //   e.preventDefault();
  //   setLoading2(true);

  //   try {
  //     const res = await axios.post("http://localhost:5000/api/payment", data);

  //     if (res.data.success && res.data.paymentUrl) {
  //       window.location.href = res.data.paymentUrl;
  //     } else {
  //       alert("Failed to initiate payment. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error in initiating payment:", error.message);
  //     alert("An error occurred while initiating the payment.");
  //   } finally {
  //     setLoading2(false);
  //   }
  // };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading2(true);

    try {
      const res = await axios.post(`${config.BASEURL}/payment`, data);

      console.log("Payment API Response:", res.data);

      if (res.data.success && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        alert(
          res.data.message || "Failed to initiate payment. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Error in initiating payment:",
        error.response?.data || error.message
      );
      alert(
        error.response?.data?.message ||
          "An error occurred while initiating the payment."
      );
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="main">
      <div className="center">
        <h2 className="fs-4 mt-2">
          <span className="text-danger fw-bold">LIVE</span> Payment Integration
        </h2>
      </div>
      <div className="card px-5 py-4 mt-5">
        <form onSubmit={handlePayment}>
          <div className="col-12 ">
            <p className="fs-5">
              <strong>Name:</strong> {data.name}
            </p>
          </div>
          <div className="col-12 ">
            <p className="fs-5">
              <strong>Number:</strong> {data.number}
            </p>
          </div>
          <div className="col-12 ">
            <p className="fs-5">
              <strong>Amount:</strong> {data.amount} Rs
            </p>
          </div>
          {!loading2 ? (
            <div className="col-12 center">
              <button className="w-100 " type="submit">
                Pay Now
              </button>
            </div>
          ) : (
            <div className="col-12 center">
              <button className="w-100 text-center" type="button" disabled>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden ">Wait...</span>
                </div>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Phonepe;
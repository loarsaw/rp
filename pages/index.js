import Head from "next/head";

import { useState } from 'react'
import { IconBrandPaypal, IconRazor } from "@tabler/icons-react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
export default function Home() {
  const [value, setValue] = useState(0)
  const [method, setPayment] = useState("razor")

  const makePayment = async () => {
    console.log("here...");
    if (method == "razor") {

      const res = await initializeRazorpay();

      if (!res) {
        alert("Razorpay SDK Failed to load");
        return;
      }

      // Make API call to the serverless API
      const data = await fetch("/api/razorpay", {
        method: "POST", body: JSON.stringify({
          amount: value
        })
      }).then((t) =>
        t.json()
      );
      var options = {
        key: process.env.RAZORPAY_KEY,
        name: "Uniford",
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        description: "Thank you for your test donation",
        image: "http://localhost:3000/logo.png",
        handler: function (response) {
          alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature);
        },
        prefill: {
          name: "Uniford Org",
          email: "uniford@gmail.com",
          contact: "9999999999",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } else {
      
    }

  };
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  return (
    <div>
      <Head>
        <title>Integrate Payments 🔥</title>
        <meta
          name="description"
          content="Integrate payments in your React and Next.js application with TailwindCSS and Razorpay"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="iphone">
        <header className="header">
          <h1>Checkout</h1>
        </header>

        <div >
          <div>
            <h2>Address</h2>

            <div className="card">
              <address>
                Adam Johnson<br />
                403 Oakland Ave Street, A city, Florida, 32104,<br />
                United States of America
              </address>
            </div>
          </div>

          <fieldset>
            <legend>Payment Method</legend>

            <div className="form__radios">


              {/* <div className="form__radio">
                <label for="paypal">
                  <IconBrandPaypal />
                  PayPal</label>
                <input
                  checked={method == "paypal"}
                  value="paypal"
                  onClick={(e) => {
                    setPayment(e.target.value)
                  }}
                  id="paypal" name="payment-method" type="radio" />
              </div> */}

              <div className="form__radio">
                <label for="mastercard">
                  <IconRazor />
                  Razorpay</label>
                <input
                  checked={method == "razor"}
                  value="razor"
                  onClick={(e) => {
                    setPayment(e.target.value)
                  }}
                  id="mastercard" name="payment-method" type="radio" />
              </div>
            </div>
          </fieldset>


          <div>
            <label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter Amount</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="tel" id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123-45-678" required />
          </div>

          <div>
            <button
              className="button button--full"
              onClick={() => {
                makePayment()
              }}
            ><></>Buy Now</button>
            <button>

            </button>
          </div>
        </div>
      </div>


    </div>
  );
}



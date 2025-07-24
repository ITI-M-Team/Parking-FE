// import React, { useState } from "react";
// import instance from "../apis/config"; // axios instance
// import { toast } from "react-toastify";

// const WalletTopUp = () => {
//   const [amount, setAmount] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("vodafone_cash");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleTopUp = async () => {
//     if (!amount || isNaN(amount) || amount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const res = await instance.post("/wallet/topup/", {
//         amount: parseFloat(amount),
//         method: paymentMethod,
//       });

//       toast.success(`Successfully topped up EGP ${amount} to your wallet`);
//       setAmount("");
//     } catch (err) {
//       toast.error("An error occurred during top-up");
//       console.error("Top-up error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-gray-900">
//       <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
//         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
//           Wallet Top-Up
//         </h2>

//         <div className="mb-5">
//           <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//             Payment Method
//           </label>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="vodafone_cash">Vodafone Cash</option>
//             <option value="instapay">InstaPay</option>
//             <option value="credit_card">Credit Card</option>
//           </select>
//         </div>

//         <div className="mb-6">
//           <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//             Amount (EGP)
//           </label>
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             placeholder="Enter amount"
//             className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <button
//           onClick={handleTopUp}
//           disabled={isLoading}
//           className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
//             isLoading
//               ? "bg-blue-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {isLoading ? "Processing..." : "Top Up Wallet"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WalletTopUp;
import React, { useState } from "react";
import instance from "../apis/config"; // axios instance
import { toast } from "react-toastify";

const WalletTopUp = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("vodafone_cash");
  const [isLoading, setIsLoading] = useState(false);

  const handleTopUp = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      const res = await instance.post("/wallet/topup/", {
        amount: parseFloat(amount),
        method: paymentMethod,
      });

      toast.success(`Successfully topped up EGP ${amount} to your wallet`);
      setAmount("");
    } catch (err) {
      toast.error("An error occurred during top-up");
      console.error("Top-up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-[#0f172a]">
      <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-dark dark:text-white">
          Wallet Top-Up
        </h2>

        <div className="mb-5">
          <label className="block mb-1 text-sm font-medium text-dark dark:text-gray-200">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#334155] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="vodafone_cash">Vodafone Cash</option>
            <option value="instapay">InstaPay</option>
            <option value="credit_card">Credit Card</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-dark dark:text-gray-200">
            Amount (EGP)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-[#334155] dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleTopUp}
          disabled={isLoading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : "Top Up Wallet"}
        </button>
      </div>
    </div>
  );
};

export default WalletTopUp;

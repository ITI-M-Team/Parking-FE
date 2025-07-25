import React, { useState } from "react";
import instance from "../apis/config"; // تأكد من أن هذا هو axios instance الصحيح
import { toast } from "react-toastify";

// --- أيقونات SVG لتحسين التصميم ---
const WalletIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;
const CardIcon = (props  ) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;

const WalletTopUp = (  ) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  // --- تم التعديل: القيمة الآن ثابتة على "card" ---
  const paymentMethod = "card"; 

  const handleInitiatePayment = async () => {
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    console.log(`🚀 [FRONTEND-LOG] Initiating payment with method: '${paymentMethod}'`);

    setIsLoading(true);
    try {
      const res = await instance.post("/wallet/initiate/", {
        amount: numericAmount,
        payment_method: paymentMethod,
      });

      if (res.data.type === "iframe" && res.data.payment_url) {
        setPaymentUrl(res.data.payment_url);
      } else {
        toast.error("Could not get payment URL from the server.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500];

  if (paymentUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 p-4">
        <div className="w-full max-w-lg text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray dark:text-white">Complete Your Payment</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Please complete the payment in the window below.</p>
        </div>
        <div className="w-full max-w-md h-[75vh] bg-white rounded-lg shadow-2xl overflow-hidden">
          <iframe src={paymentUrl} title="Paymob Secure Payment" className="w-full h-full border-0" allow="payment"></iframe>
        </div>
        <button onClick={() => setPaymentUrl("")} className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg">
          Cancel Payment
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                <WalletIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-dark dark:text-white">Top Up Your Wallet</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Add funds to your account securely.</p>
        </div>

        <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-dark dark:text-gray-300">1. Select Payment Method</label>
            {/* --- تم التعديل: إخفاء زر المحفظة وجعل زر البطاقة يملأ المساحة --- */}
            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-center gap-3 p-4 rounded-lg font-semibold bg-blue-600 text-white border-2 border-blue-600">
                    <CardIcon /> Credit Card (Selected)
                </div>
            </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-dark dark:text-gray-300">2. Choose Amount</label>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {quickAmounts.map(qAmount => (
              <button key={qAmount} onClick={() => setAmount(qAmount.toString())} className={`py-2 rounded-lg font-semibold transition-all duration-200 border-2 ${amount === qAmount.toString() ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-blue-600 dark:text-blue-400 border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700'}`}>
                {qAmount}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-bold text-gray-500 dark:text-gray-400">EGP</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full border-2 border-gray-200 dark:border-slate-600 rounded-lg pl-14 pr-4 py-3 text-lg font-bold text-gray-800 dark:text-white bg-gray-50 dark:bg-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
          </div>
        </div>

        <button onClick={handleInitiatePayment} disabled={isLoading || !amount} className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 text-base ${isLoading || !amount ? "bg-blue-300 dark:bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
          {isLoading ? "Processing..." : `Proceed to Pay ${amount ? `EGP ${amount}` : ''}`}
        </button>
      </div>
    </div>
  );
};

export default WalletTopUp;
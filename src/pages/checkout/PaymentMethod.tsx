import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

const PaymentMethods = () => {
  const [selected, setSelected] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  };

  /* const getTransactionDetails = async (transactionId: string) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/payment/transaction/${transactionId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      throw error;
    }
  }; */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const integrationIdMap: Record<string, number> = {
      card: Number(import.meta.env.VITE_CARD_INTEGRATION),
      wallet: Number(import.meta.env.VITE_WALLET_INTEGRATION),
    };

    const integration_id = Number(integrationIdMap[selected]);
    if (isNaN(integration_id)) {
      alert("معرّف التكامل غير صالح");
      setIsLoading(false);
      return;
    }

    if (!integration_id) {
      alert("الدفع عند الاستلام لا يحتاج إجراء إلكتروني.");
      setIsLoading(false);
      return;
    }

    if (!user || !user._id) {
      alert("يبدو إنك مش مسجل دخول، برجاء تسجيل الدخول أولًا");
      return;
    }

    try {
      const payload = {
        amount: 150000,
        userId: user._id,
        payment_methods: [integration_id],
        currency: "EGP",
        items: [
          {
            name: "Samsung Galaxy S24",
            amount: 150000,
            quantity: 1,
            description: "هاتف ممتاز بشاشة AMOLED",
          },
        ],
        billing_data: {
          first_name: "Mahmoud",
          last_name: "Ali",
          email: "mahmoud@example.com",
          phone_number: "+201000000000",
          country: "EG",
          city: "Giza",
          street: "شارع النيل",
          building: "25B",
          floor: "3",
          apartment: "6",
          state: "الجيزة",
          postal_code: "12566",
        },
        customer: {
          first_name: "Mahmoud",
          last_name: "Ali",
          email: "mahmoud@example.com",
        },
        extras: {
          cart_id: "crt_7890",
        },
        expiration: 3600,
        special_reference: `ORD_${Date.now()}`,
        redirection_url: `${import.meta.env.VITE_FRONTEND_API_URL}`,
        notification_url: `${
          import.meta.env.VITE_FRONTEND_API_URL
        }/api/paymob/webhook`,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-payment`,
        payload
      );
      console.log("🎯 RESPONSE:", data);
      // const orderId = data.payment_keys?.[0]?.order_id;
      if (!data || !Array.isArray(data.payment_keys) || !data.payment_keys[0]) {
        alert(`💥 Paymob raw response:, ${JSON.stringify(data, null, 2)}`);
        alert("فشل استلام بيانات الدفع من Paymob");
        setIsLoading(false);
        return;
      }

      console.log("📦 Full response from Paymob:", data);
      console.log("📎 payment_keys[0]:", data.payment_keys?.[0]);
      console.log("🧾 order_id:", data.payment_keys?.[0]?.order_id);

      /* if (orderId) {
        const transactionDetails = await getTransactionDetails(orderId);
        console.log("تفاصيل المعاملة:", transactionDetails);
      } */

      if (!data.client_secret) {
        alert("لم يتم استلام client_secret من Paymob");
        setIsLoading(false);
        return;
      }

      const checkoutURL = `https://accept.paymob.com/unifiedcheckout/?publicKey=${
        import.meta.env.PAYMOB_PUBLIC_KEY
      }&clientSecret=${data.client_secret}`;
      window.location.href = checkoutURL;
    } catch (error) {
      console.error("فشل الإجراء:", error);
      alert("حدث خطأ أثناء معالجة الدفع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-right">
      <h2 className="text-2xl font-bold mb-4">💳 طرق الدفع</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label
          className={`flex items-center justify-between border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors duration-200 ${
            selected === "card"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="card"
            checked={selected === "card"}
            onChange={handleChange}
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-800">
            <span className="text-gray-500 text-xs">(Visa / MasterCard)</span>{" "}
            💳 الدفع باستخدام بطاقة بنكية
          </span>
        </label>

        <label
          className={`flex items-center justify-between border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors duration-200 ${
            selected === "wallet"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="wallet"
            checked={selected === "wallet"}
            onChange={handleChange}
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-800">
            <span className="text-gray-500 text-xs">
              (Vodafone Cash - Orange - Etisalat)
            </span>{" "}
            📱 الدفع باستخدام محفظة إلكترونية
          </span>
        </label>

        <label
          className={`flex items-center justify-between border-2 rounded-lg px-4 py-3 cursor-pointer transition-colors duration-200 ${
            selected === "cod"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={selected === "cod"}
            onChange={handleChange}
            className="accent-blue-600 w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-800">
            <span className="text-gray-500 text-xs">(COD)</span> 💰 الدفع عند
            الاستلام
          </span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded mt-6 cursor-pointer disabled:bg-blue-400"
          disabled={isLoading}
        >
          {isLoading ? "جاري المعالجة..." : "التالي ➡️"}
        </button>
      </form>
    </div>
  );
};

export default PaymentMethods;

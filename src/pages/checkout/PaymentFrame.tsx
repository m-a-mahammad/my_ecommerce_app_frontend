import { useParams } from "react-router-dom";

const PaymentFrame = () => {
  const { token, iframeId } = useParams();

  const iframeURL = `https://accept.paymob.com/api/acceptance/iframe/${iframeId}?payment_token=${token}`;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <iframe
        src={iframeURL}
        title="Payment Frame"
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default PaymentFrame;

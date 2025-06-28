import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: { url: string };
  brand: string;
  category: string;
  stock: number;
}

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/${slug}`, {
        withCredentials: true,
      })
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleMobileWalletCheckout = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/init-wallet`,
        {
          amount: 250, // المبلغ بالجنيه أو من السلة
          phone: "010xxxxxxxx", // رقم المستخدم للمحفظة
        },
        { withCredentials: true }
      );

      // إعادة التوجيه لصفحة الدفع
      window.location.href = data.redirect_url;
    } catch (err) {
      console.error("❌ فشل في إنشاء الدفع", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <Skeleton className="h-6 w-2/3 mb-4" />
        <Skeleton className="h-96 w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!product) {
    return <p className="text-center mt-10">لم يتم العثور على المنتج.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 text-right" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src={product.image?.url}
            alt={product.name}
            className="w-full h-auto object-contain rounded"
          />
          <div className="flex justify-between h-full flex-col">
            <div>
              <p className="mb-3 text-gray-700 leading-relaxed">
                {product.description}
              </p>
              <p className="mb-2">
                <span className="font-semibold">العلامة التجارية:</span>{" "}
                {product.brand}
              </p>
              <p className="mb-2">
                <span className="font-semibold">التصنيف:</span>{" "}
                {product.category}
              </p>
              <p className="mb-2">
                <span className="font-semibold">الكمية المتاحة:</span>{" "}
                {product.stock}
              </p>
              <p className="text-green-700 text-xl font-bold mt-4">
                السعر: {product.price} جنيه
              </p>
            </div>
            <button
              onClick={handleMobileWalletCheckout}
              className="bg-blue-600 text-white w-full justify-center py-3 mb-8 rounded-lg text-lg hover:bg-blue-700 transition cursor-pointer"
            >
              إتمام الدفع عبر المحفظة الإلكترونية 📱
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;

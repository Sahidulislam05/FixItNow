import axios from "axios";
import config from "../config";

const SSLCOMMERZ_SANDBOX_INIT_URL =
  "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const SSLCOMMERZ_SANDBOX_VALIDATION_URL =
  "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

export interface ISSLCommerzInitPayload {
  total_amount: number;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  cus_name: string;
  cus_email: string;
  cus_phone?: string;
}

const initSession = async (payload: ISSLCommerzInitPayload) => {
  const paymentData = {
    store_id: config.ssl_commerz_store_id,
    store_passwd: config.ssl_commerz_store_passwd,
    currency: "BDT",
    cus_add1: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: payload.cus_phone || "01700000000",
    shipping_method: "NO",
    product_name: "FixItNow Home Service Booking",
    product_category: "Service",
    product_profile: "general",
    ...payload,
  };

  const response = await axios.post(SSLCOMMERZ_SANDBOX_INIT_URL, paymentData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data as {
    GatewayPageURL?: string;
    status?: string;
    [key: string]: unknown;
  };
};

const validateTransaction = async (valId: string) => {
  const response = await axios.get(SSLCOMMERZ_SANDBOX_VALIDATION_URL, {
    params: {
      val_id: valId,
      store_id: config.ssl_commerz_store_id,
      store_passwd: config.ssl_commerz_store_passwd,
      format: "json",
    },
  });

  return response.data as { status?: string; [key: string]: unknown };
};

export const sslCommerzService = {
  initSession,
  validateTransaction,
};

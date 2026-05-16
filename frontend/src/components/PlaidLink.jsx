import { usePlaidLink } from "react-plaid-link";
import { useEffect, useState, useCallback } from "react";
import useMoneyStore from "../store/MoneyStore";

const PlaidLink = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const refetchFromBank = useMoneyStore(state => state.refetchFromBank);

  useEffect(() => {
    if (linkToken) return;
    const getLinkToken = async () => {
      try {
        const res = await fetch("/api/plaid/create-link-token", {
          method: "POST",
          credentials: "include",
        });
        const data = await res.json();
        console.log("Link token received:", data.link_token ? "OK" : "FAILED");
        setLinkToken(data.link_token);
      } catch (err) {
        console.error("Link token fetch error:", err);
      }
    };
    getLinkToken();
  }, []);

  const onSuccess = useCallback(async (public_token) => {
    setLoading(true);
    try {
      const res = await fetch("/api/plaid/exchange-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ public_token }),
      });
      const data = await res.json();
      console.log("Bank import result:", data.message);

      // Refresh dashboard using your actual store functions
      await refetchFromBank();
    } catch (err) {
      console.error("Exchange error:", err);
    }
    setLoading(false);
  }, [refetchFromBank]);

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
  });

  if (!linkToken) return (
    <button className="btn btn-outline btn-sm" disabled>
      Loading bank...
    </button>
  );

  return (
    <button
      onClick={() => open()}
      disabled={!ready || loading}
      className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Importing..." : "Connect Bank"}
    </button>
  );
};

export default PlaidLink;
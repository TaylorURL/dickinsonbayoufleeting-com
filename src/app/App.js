import { useEffect, useState } from "react";
import HomeView from "../views/HomeView";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import InquiryModal from "../components/InquiryModal";
import "./styles/App.css";
import "./styles/Buttons.css";

const INQUIRY_ENDPOINT =
  "https://gujgtjqqurildqurpffh.supabase.co/functions/v1/inquiry-service";

function App() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const handleInquirySubmit = async (data) => {
    const response = await fetch(INQUIRY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Inquiry submission failed");
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const apply = () =>
      document.documentElement.setAttribute(
        "data-theme",
        mq.matches ? "light" : "dark",
      );
    apply();
    const handler = () => setInquiryOpen(true);
    window.addEventListener("inquiry:open", handler);

    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      return () => {
        mq.removeEventListener("change", apply);
        window.removeEventListener("inquiry:open", handler);
      };
    } else {
      mq.addListener(apply);
      return () => {
        mq.removeListener(apply);
        window.removeEventListener("inquiry:open", handler);
      };
    }
  }, []);

  return (
    <div className="App">
      <NavBar />
      <HomeView />
      <Footer />
      <InquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        onSubmit={handleInquirySubmit}
      />
    </div>
  );
}

export default App;

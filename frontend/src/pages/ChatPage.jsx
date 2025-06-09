import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios, { setAuthToken } from "../api/axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speech = SpeechRecognition ? new SpeechRecognition() : null;

function ChatPage() {
  const { token, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!token) return navigate("/");
    setAuthToken(token);
    fetchHistory();
  }, [navigate, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("/chat/history");
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load chat history.");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      message: input,
      is_bot: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      await axios.post("/chat/log", userMsg);
      let res;

      
      if (input.toLowerCase().includes("recommend") || input.toLowerCase().includes("suggest")) {
        res = await axios.get("/chat/recommendations");
      } else {
        res = await axios.get(`/products/search?q=${input}`);
      }


      if (res.data.length) {
        const productMessages = res.data.slice(0, 3).map((product) => ({
          is_bot: true,
          timestamp: new Date().toISOString(),
          message: `🛍️ ${product.name}\n₹${product.price} — ${product.category}\n${product.in_stock ? "✅ In Stock" : "❌ Out of Stock"}`,
        }));

        for (const msg of productMessages) {
          setMessages((prev) => [...prev, msg]);
          await axios.post("/chat/log", msg);
        }
      } else {
        const botMsg = {
          message: "Product not found.",
          is_bot: true,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMsg]);
        await axios.post("/chat/log", botMsg);
      }
    } catch (err) {
      const botMsg = {
        message: "⚠️ An error occurred while processing your request.",
        is_bot: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }

    setLoading(false);
  };

  const toggleListening = () => {
    if (!speech) {
      toast.error("Voice recognition not supported in this browser.");
      return;
    }

    if (listening) {
      speech.stop();
      setListening(false);
      return;
    }

    speech.start();
    setListening(true);

    speech.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };

    speech.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast.error("Voice recognition failed.");
      setListening(false);
    };

    speech.onend = () => {
      setListening(false);
    };
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleReset = async () => {
  setMessages([]);
  toast.success("Conversation reset");

  setTimeout(async () => {
    const rating = prompt("How would you rate this session (1–5)?");
    const comment = prompt("Any feedback to help us improve?");

    if (rating || comment) {
      try {
        await axios.post("/chat/feedback", {
          rating: parseInt(rating),
          comments: comment || ""
        });
        toast.success("✅ Feedback submitted. Thanks!");
      } catch {
        toast.error("❌ Failed to send feedback.");
      }
    }
  }, 500);
};


  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🛒 Uplyft Chatbot Assistant</h1>
        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-3 rounded shadow max-w-[70%] whitespace-pre-wrap ${
              msg.is_bot ? "bg-gray-200 text-left" : "bg-blue-100 ml-auto text-right"
            }`}
          >
            <div>{msg.message}</div>
            <div className="text-xs text-gray-600 mt-1">
              {msg.is_bot ? "Bot" : "You"} • {dayjs(msg.timestamp).format("HH:mm")}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </main>

      <footer className="bg-white p-4 flex gap-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded" disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
        <button onClick={toggleListening} className={`${listening ? "bg-red-600" : "bg-green-600"} text-white px-3 rounded`}>
          {listening ? "🛑" : "🎙️"}
        </button>
        <button onClick={handleReset} className="bg-gray-400 text-white px-3 rounded">
          🔄
        </button>
      </footer>
    </div>
  );
}

export default ChatPage;

import React, { useState, useRef } from "react";
function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const inputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userInput = event.target.elements.message.value;
    updateChatHistory({ role: "you", content: userInput });
    updateChatHistory({ role: "waiting", content: "" });
    clearInput(event);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseData = await response.json();
      setChatHistory((prevHistory) => prevHistory.slice(0, -1));
      updateChatHistory({ role: "chatDsa", content: responseData.message });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateChatHistory = (newMessage) => {
    setChatHistory((prevHistory) => [...prevHistory, newMessage]);
  };

  const clearInput = (e) => {
    e.target.elements.message.value = "";
    inputRef.current.focus();
  };

  return (
    <div className="container">
      <h2 className="title">ChatDSA - Cấu trúc dữ liệu và giải thuật</h2>
      <div className="conversation">
        <ul>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              style={{ textAlign: msg.role === "you" ? "left" : "right" }}
            >
              {msg.role === "waiting" ? (
                <li className="_loader"></li>
              ) : (
                <li>{msg.content}</li>
              )}
            </div>
          ))}
        </ul>
      </div>
      <form className="form-chat" onSubmit={handleSubmit}>
        <input
          id="input-text"
          type="text"
          name="message"
          placeholder="Enter your message"
          ref={inputRef}
          autoFocus
        />
        <input id="submit-btn" type="submit" value="Gửi" />
      </form>
    </div>
  );
}

export default App;

const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = `my-2 p-3 rounded-lg max-w-xl ${
    sender === "user"
      ? "bg-accent text-white self-end ml-auto"
      : "bg-gray-700 text-white self-start mr-auto"
  }`;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  // Send message to server
  try {
    const res = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    appendMessage("ai", data.reply);
  } catch (err) {
    appendMessage("ai", "⚠️ Error connecting to server.");
    console.error(err);
  }
});

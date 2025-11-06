const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Simple AI brain (local)
function localAIResponse(msg) {
  msg = msg.toLowerCase();

  // Greetings
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
    return "Hey there! 👋 I'm Dora, your chat buddy!";
  if (msg.includes("good morning")) return "Good morning 🌞! Hope you have an awesome day!";
  if (msg.includes("good night")) return "Good night 🌙! Sleep tight and dream happy things!";

  // Personal
  if (msg.includes("how are you")) return "I’m doing great 😊 What about you?";
  if (msg.includes("your name")) return "I’m Dora 💬, your friendly chatbot!";
  if (msg.includes("who made you")) return "I was created by Akshit 💻✨";
  if (msg.includes("love")) return "Aww ❤️ Love makes everything better!";
  if (msg.includes("i miss you")) return "Aww 🥺 I miss you too!";
  if (msg.includes("sorry")) return "It's okay 💖 I forgive you!";
  if (msg.includes("thank")) return "You're most welcome 😄";

  // Fun
  if (msg.includes("joke"))
    return "😂 Why don’t programmers like nature? It has too many bugs!";
  if (msg.includes("time")) return "⏰ Current time is: " + new Date().toLocaleTimeString();
  if (msg.includes("date")) return "📅 Today’s date is: " + new Date().toLocaleDateString();
  if (msg.includes("weather"))
    return "I can’t check weather right now ☁️ but I hope it’s nice where you are!";

  // Emotions
  if (msg.includes("sad")) return "Don’t be sad 🫂 I’m here for you 💖";
  if (msg.includes("happy")) return "Yay! 😄 I’m happy that you’re happy!";
  if (msg.includes("angry")) return "Take a deep breath 😤 Everything will be okay!";

  // Default fallback
  return "Hmm... interesting! Tell me more 😄";
}

// Message creation
function createMessageBox(message, sender) {
  const box = document.createElement("div");
  box.classList.add(sender === "ai" ? "ai-chat-box" : "user-chat-box");

  const img = document.createElement("img");
  img.src =
    sender === "ai"
      ? "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
      : "https://cdn-icons-png.flaticon.com/512/4333/4333609.png";
  img.alt = sender;

  const area = document.createElement("div");
  area.classList.add(sender === "ai" ? "ai-chat-area" : "user-chat-area");
  area.textContent = message;

  box.appendChild(img);
  box.appendChild(area);
  chatBox.appendChild(box);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing effect
function showTyping() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("ai-chat-box");
  typingDiv.id = "typing";
  typingDiv.innerHTML = `
    <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" width="50">
    <div class="ai-chat-area"><em>Dora is typing...</em></div>
  `;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typingDiv = document.getElementById("typing");
  if (typingDiv) typingDiv.remove();
}

// AI Response
async function getAIResponse(message) {
  showTyping();

  // Simulate delay for realism
  await new Promise((res) => setTimeout(res, 1000));

  removeTyping();
  const reply = localAIResponse(message);
  createMessageBox(reply, "ai");
}

// Send message
function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  createMessageBox(message, "user");
  userInput.value = "";
  getAIResponse(message);
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

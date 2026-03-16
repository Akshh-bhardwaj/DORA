const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Helper to get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple AI brain (local)
function localAIResponse(msg) {
  msg = msg.toLowerCase();

  // Greetings
  if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey"))
    return "Hey there! 👋 I'm Dora, your AI assistant.";
  if (msg.includes("good morning")) return "Good morning 🌞! Hope you have an awesome day!";
  if (msg.includes("good night")) return "Good night 🌙! Sleep tight and dream happy things!";

  // Personal
  if (msg.includes("how are you")) return "I’m operating at optimal capacity 😊 How can I help you today?";
  if (msg.includes("your name")) return "I’m Dora ✨, your intelligent chatbot!";
  if (msg.includes("who made you")) return "I was engineered by Akshit 💻✨";
  if (msg.includes("love")) return "Aww ❤️ That's wonderful!";
  if (msg.includes("i miss you")) return "I'm always here when you need me! 🤖";
  if (msg.includes("sorry")) return "No need to apologize! 💖 How can we move forward?";
  if (msg.includes("thank")) return "You're very welcome! Let me know if you need anything else. 😄";

  // Fun
  if (msg.includes("joke"))
    return "😂 Why do programmers prefer dark mode? Because light attracts bugs!";
  if (msg.includes("time")) return "⏰ The current time is " + getCurrentTime() + ".";
  if (msg.includes("date")) return "📅 Today’s date is " + new Date().toLocaleDateString() + ".";
  if (msg.includes("weather"))
    return "I don't have internet access to check the weather right now ☁️, but I hope it’s sunny!";

  // Default fallback
  const responses = [
      "That is fascinating! Can you tell me more?",
      "I see. How does that make you feel?",
      "Interesting perspective! Let's explore that further.",
      "Got it! I am here to assist with whatever you need."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Message creation template
function createMessageElements(message, sender) {
    const wrapper = document.createElement("div");
    wrapper.className = `message-wrapper ${sender === 'ai' ? 'ai-message-wrapper' : 'user-message-wrapper'}`;

    const img = document.createElement("img");
    img.className = "message-avatar";
    img.src = sender === "ai"
      ? "https://ui-avatars.com/api/?name=Dora&background=4a80f0&color=fff&rounded=true"
      : "https://ui-avatars.com/api/?name=You&background=ec4899&color=fff&rounded=true";
    img.alt = sender;

    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${sender === 'ai' ? 'ai-bubble' : 'user-bubble'}`;
    
    // Process markdown-like basic formatting (bold)
    const formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    bubble.innerHTML = formattedMessage;

    const timeRow = document.createElement("div");
    timeRow.className = "message-time";
    timeRow.textContent = getCurrentTime();
    
    bubble.appendChild(timeRow);
    wrapper.appendChild(img);
    wrapper.appendChild(bubble);
    
    return wrapper;
}

function appendMessage(wrapper) {
    chatBox.appendChild(wrapper);
    // Smooth scroll to bottom
    setTimeout(() => {
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: 'smooth'
        });
    }, 50);
}

// Typing effect
function showTyping() {
  const wrapper = document.createElement("div");
  wrapper.className = "message-wrapper ai-message-wrapper";
  wrapper.id = "typingIndicator";
  
  const img = document.createElement("img");
  img.className = "message-avatar";
  img.src = "https://ui-avatars.com/api/?name=Dora&background=4a80f0&color=fff&rounded=true";
  
  const bubble = document.createElement("div");
  bubble.className = "message-bubble ai-bubble";
  bubble.innerHTML = `
    <div class="typing-indicator">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  
  wrapper.appendChild(img);
  wrapper.appendChild(bubble);
  appendMessage(wrapper);
}

function removeTyping() {
  const typingDiv = document.getElementById("typingIndicator");
  if (typingDiv) {
      // Fade out animation before removing
      typingDiv.style.opacity = '0';
      typingDiv.style.transform = 'translateY(-10px)';
      typingDiv.style.transition = 'all 0.3s ease';
      setTimeout(() => typingDiv.remove(), 300);
  }
}

// AI Response
async function getAIResponse(message) {
  showTyping();

  // Dynamic artificial delay based on message length (simulating "thinking/typing")
  const delay = Math.max(800, Math.min(2500, message.length * 50));
  await new Promise((res) => setTimeout(res, delay));

  removeTyping();
  setTimeout(() => {
      const reply = localAIResponse(message);
      const msgWrapper = createMessageElements(reply, "ai");
      appendMessage(msgWrapper);
  }, 300); // Wait for typing indicator to fade out
}

// Send message
function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  const msgWrapper = createMessageElements(message, "user");
  appendMessage(msgWrapper);
  
  userInput.value = "";
  userInput.focus();
  
  // Slight delay before AI starts typing for natural feel
  setTimeout(() => {
      getAIResponse(message);
  }, 400);
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Focus input on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => userInput.focus(), 800);
});

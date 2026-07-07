const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Helper to get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    
    // Process markdown with marked library if available, otherwise fallback to simple bold regex
    if (sender === "ai" && typeof marked !== 'undefined') {
        bubble.innerHTML = marked.parse(message);
    } else {
        const formattedMessage = message
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        bubble.innerHTML = formattedMessage;
    }

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

  try {
      const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: message })
      });
      
      const data = await response.json();
      removeTyping();
      
      setTimeout(() => {
          if (response.ok && data.reply) {
              const msgWrapper = createMessageElements(data.reply, "ai");
              appendMessage(msgWrapper);
          } else if (data.quota_exceeded) {
              const msgWrapper = createMessageElements(data.reply, "ai");
              appendMessage(msgWrapper);
          } else {
              console.error("API Error:", data.error);
              const msgWrapper = createMessageElements("Oops! I'm having trouble connecting to my brain right now. " + (data.error || "Please check the server."), "ai");
              appendMessage(msgWrapper);
          }
      }, 300); // Wait for typing indicator to fade out
  } catch (err) {
      console.error("Fetch Error:", err);
      removeTyping();
      setTimeout(() => {
          const msgWrapper = createMessageElements("Oops! It looks like my server isn't running properly.", "ai");
          appendMessage(msgWrapper);
      }, 300);
  }
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

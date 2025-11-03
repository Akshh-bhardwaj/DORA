const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.querySelector(".chat-box");

let userName = localStorage.getItem("username") || "";

// Function to create chat bubble
function createChatBubble(message, isUser) {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add(isUser ? "user-chat-box" : "ai-chat-box");

  const img = document.createElement("img");
  img.src = isUser
    ? "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
    : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";

  const textDiv = document.createElement("div");
  textDiv.classList.add(isUser ? "user-chat-area" : "ai-chat-area");
  textDiv.textContent = message;

  chatDiv.appendChild(isUser ? textDiv : img);
  chatDiv.appendChild(isUser ? img : textDiv);
  chatBox.appendChild(chatDiv);

  // Auto scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to generate Dora's response
async function getDoraResponse(input) {
  input = input.toLowerCase();

  if (!userName) {
    userName = input.charAt(0).toUpperCase() + input.slice(1);
    localStorage.setItem("username", userName);
    return `Nice to meet you, ${userName}! How can I help you today? 😊`;
  }

  const jokes = [
    "Why don’t skeletons fight each other? They don’t have the guts!",
    "Why did the computer go to therapy? It had a hard drive!",
    "What did one ocean say to the other ocean? Nothing, they just waved!"
  ];

  const facts = [
    "Honey never spoils — archaeologists found edible honey in ancient Egyptian tombs.",
    "Bananas are berries, but strawberries aren’t!",
    "Octopuses have three hearts and blue blood."
  ];

  if (input.includes("joke")) {
    return jokes[Math.floor(Math.random() * jokes.length)];
  } else if (input.includes("time")) {
    return `🕒 The current time is ${new Date().toLocaleTimeString()}`;
  } else if (input.includes("fact")) {
    return facts[Math.floor(Math.random() * facts.length)];
  } else if (input.includes("news")) {
    try {
      const apiKey = "23efd6007b5b4faa8de1c59152267b7a"; // your NewsAPI key
      const res = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`);
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        const top3 = data.articles.slice(0, 3).map((a, i) => `${i + 1}. ${a.title}`).join("\n\n");
        return `📰 Here are today's top headlines:\n\n${top3}`;
      } else {
        return "Hmm... I couldn't find any news right now.";
      }
    } catch {
      return "⚠️ Sorry! I had trouble fetching the news right now.";
    }
  } else if (input.includes("clear name") || input.includes("forget me")) {
    localStorage.removeItem("username");
    userName = "";
    return "Got it! I forgot your name. What should I call you now?";
  } else if (input.includes("hello") || input.includes("hi")) {
    return `Hey ${userName}! 👋 How are you today?`;
  } else {
    return `Hmm… I’m not sure about that, ${userName}, but I can tell jokes, time, facts, or live news!`;
  }
}

// Handle send button click
sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (message === "") return;

  createChatBubble(message, true);
  userInput.value = "";

  setTimeout(async () => {
    const response = await getDoraResponse(message);
    createChatBubble(response, false);
  }, 400);
});

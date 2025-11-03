const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chatContainer = document.querySelector(".chat-container");

// Function to create a chat bubble
function createChatBubble(message, isUser) {
  const chatBox = document.createElement("div");
  chatBox.classList.add(isUser ? "user-chat-box" : "ai-chat-box");

  const img = document.createElement("img");
  img.src = isUser
    ? "https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
    : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";
  img.alt = isUser ? "User" : "Dora";
  img.width = 50;

  const chatArea = document.createElement("div");
  chatArea.classList.add(isUser ? "user-chat-area" : "ai-chat-area");
  chatArea.textContent = message;

  chatBox.appendChild(isUser ? chatArea : img);
  chatBox.appendChild(isUser ? img : chatArea);

  chatContainer.insertBefore(chatBox, document.querySelector(".prompt-area"));
}

// Function to generate Dora’s response
async function getDoraResponse(input) {
  input = input.toLowerCase();
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
    return "🕒 The current time is " + new Date().toLocaleTimeString();
  } else if (input.includes("fact")) {
    return facts[Math.floor(Math.random() * facts.length)];
  } else if (input.includes("news")) {
    // 📰 Fetch real news from NewsAPI
    try {
      const apiKey = "23efd6007b5b4faa8de1c59152267b7a"; // ← your API key
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`);
      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        const top3 = data.articles.slice(0, 3).map((a, i) => `${i + 1}. ${a.title}`).join("\n\n");
        return `📰 Here are today's top headlines:\n\n${top3}`;
      } else {
        return "Hmm... I couldn't find any news right now.";
      }
    } catch (error) {
      return "⚠️ Sorry! I had trouble fetching the news right now.";
    }
  } else if (input.includes("hello") || input.includes("hi")) {
    return "Hey there! I'm Dora 🤖 — your chat buddy!";
  } else {
    return "Hmm… I’m not sure about that, but I can tell jokes, time, facts, and live news!";
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
  }, 500);
});

/* ==========================
   Hero
========================== */
.hero {
  position: relative;
  height: 80vh;
  background: url('images/hero.jpg') no-repeat center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.3rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .hero { height: 260px; padding: 0 10px; }
  .hero h1 { font-size: 1.6rem; }
  .hero p { font-size: 1rem; }
}

:root {
  --bg: #f4f7ef;
  --accent: #5a7c46;
  --accent-hover: #3a6146;
  --text: #333;
  --muted: #555;
  --radius: 12px;
}

/* Reset cơ bản */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
}

h1, h2, h3, h4 {
  font-family: "Playfair Display", serif;
  color: var(--accent);
  margin-bottom: .5rem;
}

a {
  text-decoration: none;
  color: inherit;
}

.container {
  width: 90%;
  max-width: 1100px;
  margin: auto;
}
#chatbot-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  font-family: Arial, sans-serif;
}

#chatbot-button {
  background-color: #f7b6c9;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

#chatbot-box {
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  bottom: 70px;
  right: 0;
}

.hidden {
  display: none;
}

.chat-header {
  background-color: #f7b6c9;
  padding: 12px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.bot-message, .user-message {
  margin: 8px 0;
  padding: 8px 12px;
  max-width: 80%;
  border-radius: 10px;
  font-size: 14px;
}

.bot-message {
  background-color: #ffe6f0;
  align-self: flex-start;
}

.user-message {
  background-color: #d1f5ff;
  align-self: flex-end;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ddd;
}

#chat-input-field {
  flex: 1;
  padding: 8px;
  border: none;
  font-size: 14px;
}

#chat-send {
  padding: 8px 12px;
  background-color: #f7b6c9;
  border: none;
  color: white;
  cursor: pointer;
}

.chat-suggestions {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggest-btn {
  background: #fdd6e2;
  border: none;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
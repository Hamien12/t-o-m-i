// ==========================
// AI Chatbot for HaMiên Website
// ==========================

class HaMienChatbot {
  constructor() {
    this.isOpen = false;
    this.chatHistory = [];
    this.isTyping = false;
    this.apiKey = null; // Sẽ được cấu hình sau
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadChatHistory();
    this.showWelcomeMessage();
  }

  bindEvents() {
    const chatButton = document.getElementById("chatbot-button");
    const chatBox = document.getElementById("chatbot-box");
    const closeBtn = document.getElementById("chat-close");
    const chatSend = document.getElementById("chat-send");
    const chatInput = document.getElementById("chat-input-field");

    // Toggle chat
    if (chatButton && chatBox) {
      chatButton.addEventListener("click", () => {
        this.toggleChat();
      });
    }

    // Close chat
    if (closeBtn && chatBox) {
      closeBtn.addEventListener("click", () => {
        this.closeChat();
      });
    }

    // Send message
    if (chatSend && chatInput) {
      chatSend.addEventListener("click", () => {
        this.sendMessage();
      });
    }

    // Send on Enter
    if (chatInput) {
      chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    // Handle suggestion buttons
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("suggest-btn")) {
        const suggestion = event.target.textContent.trim();
        this.handleSuggestion(suggestion);
      }
    });
  }

  toggleChat() {
    const chatBox = document.getElementById("chatbot-box");
    if (!chatBox) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      chatBox.classList.remove("hidden");
      document.getElementById("chat-input-field")?.focus();
    } else {
      chatBox.classList.add("hidden");
    }
  }

  closeChat() {
    const chatBox = document.getElementById("chatbot-box");
    if (chatBox) {
      chatBox.classList.add("hidden");
      this.isOpen = false;
    }
  }

  showWelcomeMessage() {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    // Clear existing messages
    chatBody.innerHTML = '';

    // Add welcome message
    this.addBotMessage("Xin chào! Tôi là chatbot của Hạ Miên 🌸 Tôi có thể giúp bạn tư vấn về các dịch vụ hoa tươi của chúng tôi. Bạn cần hỗ trợ gì ạ?");

    // Add suggestions
    this.addSuggestions();
  }

  addSuggestions() {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const suggestions = [
      "Đặt hoa theo mẫu",
      "Tư vấn về hoa",
      "Thiết kế theo yêu cầu",
      "Đặt hoa giao ngay",
      "Deal hot theo mùa",
      "Hỏi về đơn hàng",
      "Tổ chức sự kiện",
      "CSKH sau mua"
    ];

    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.className = "chat-suggestions";

    suggestions.forEach(suggestion => {
      const btn = document.createElement("button");
      btn.className = "suggest-btn";
      btn.textContent = suggestion;
      suggestionsDiv.appendChild(btn);
    });

    chatBody.appendChild(suggestionsDiv);
  }

  handleSuggestion(suggestion) {
    this.addUserMessage(suggestion);
    this.processMessage(suggestion);
  }

  sendMessage() {
    const chatInput = document.getElementById("chat-input-field");
    if (!chatInput) return;

    const message = chatInput.value.trim();
    if (!message) return;

    this.addUserMessage(message);
    this.processMessage(message);
    chatInput.value = "";
  }

  addUserMessage(text) {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    // Remove suggestions if they exist
    const suggestions = chatBody.querySelector(".chat-suggestions");
    if (suggestions) {
      suggestions.remove();
    }

    const message = document.createElement("div");
    message.className = "user-message";
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Save to history
    this.chatHistory.push({ type: 'user', message: text, timestamp: new Date() });
  }

  addBotMessage(text) {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const message = document.createElement("div");
    message.className = "bot-message";
    message.textContent = text;
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Save to history
    this.chatHistory.push({ type: 'bot', message: text, timestamp: new Date() });
    this.saveChatHistory();
  }

  showTypingIndicator() {
    if (this.isTyping) return;
    
    this.isTyping = true;
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const typingDiv = document.createElement("div");
    typingDiv.className = "typing-indicator";
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    return typingDiv;
  }

  hideTypingIndicator(typingDiv) {
    if (typingDiv) {
      typingDiv.remove();
    }
    this.isTyping = false;
  }

  async processMessage(message) {
    const typingDiv = this.showTypingIndicator();

    try {
      // First try AI API if available
      if (this.apiKey) {
        const aiResponse = await this.getAIResponse(message);
        this.hideTypingIndicator(typingDiv);
        this.addBotMessage(aiResponse);
        return;
      }
    } catch (error) {
      console.log("AI API not available, using fallback responses");
    }

    // Fallback to rule-based responses
    setTimeout(() => {
      this.hideTypingIndicator(typingDiv);
      const response = this.getFallbackResponse(message);
      this.addBotMessage(response);
    }, 1000 + Math.random() * 1000); // Simulate typing delay
  }

  async getAIResponse(message) {
    if (!this.apiKey) {
      throw new Error("API key not configured");
    }

    const systemPrompt = `Bạn là chatbot của cửa hàng hoa tươi Hạ Miên. 
    Hãy trả lời một cách thân thiện, nhiệt tình và chuyên nghiệp về các dịch vụ hoa tươi.
    Thông tin về cửa hàng:
    - Tên: Hạ Miên
    - Địa chỉ: 422 Vĩnh Hưng
    - Hotline: 0987654321
    - Dịch vụ: Hoa tươi, gói quà, giao hàng nhanh, tổ chức sự kiện
    - Phong cách: Thân thiện, chuyên nghiệp, nhiệt tình
    Hãy trả lời ngắn gọn, súc tích và hướng dẫn khách hàng cụ thể.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...this.chatHistory.slice(-10).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.message
      })),
      { role: "user", content: message }
    ];

    const response = await fetch(this.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    // Keyword-based responses
    if (lowerMessage.includes('đặt hoa') || lowerMessage.includes('mua hoa')) {
      return "Cảm ơn bạn đã quan tâm đến dịch vụ của Hạ Miên! 🌸 Bạn có thể đặt hoa qua hotline 0987654321 hoặc đến trực tiếp tại 422 Vĩnh Hưng. Bạn muốn đặt loại hoa nào ạ?";
    }

    if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      return "Giá hoa tại Hạ Miên rất cạnh tranh và phụ thuộc vào loại hoa và kích thước. Bạn có thể gọi hotline 0987654321 để được báo giá chi tiết nhé! 💐";
    }

    if (lowerMessage.includes('giao hàng') || lowerMessage.includes('delivery')) {
      return "Hạ Miên có dịch vụ giao hàng nhanh chóng và tận nơi! 🚚 Chúng tôi đảm bảo hoa được giao tươi và đúng giờ. Bạn ở khu vực nào để tôi tư vấn thời gian giao hàng ạ?";
    }

    if (lowerMessage.includes('sự kiện') || lowerMessage.includes('event')) {
      return "Hạ Miên chuyên tổ chức hoa cho các sự kiện lớn nhỏ! 🎉 Bạn có thể cho tôi biết quy mô, concept và thời gian để tôi tư vấn chi tiết nhé!";
    }

    if (lowerMessage.includes('tư vấn') || lowerMessage.includes('advice')) {
      return "Tôi rất vui được tư vấn cho bạn! 💡 Bạn muốn tư vấn về ý nghĩa hoa, cách chọn hoa phù hợp, hay cách chăm sóc hoa ạ?";
    }

    if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
      return "Không có gì ạ! 😊 Hạ Miên luôn sẵn sàng phục vụ bạn. Bạn còn cần hỗ trợ gì nữa không?";
    }

    if (lowerMessage.includes('chào') || lowerMessage.includes('hello')) {
      return "Xin chào! 👋 Tôi là chatbot của Hạ Miên, rất vui được gặp bạn! Bạn cần tôi hỗ trợ gì về dịch vụ hoa tươi ạ?";
    }

    if (lowerMessage.includes('địa chỉ') || lowerMessage.includes('address')) {
      return "Cửa hàng Hạ Miên tọa lạc tại 422 Vĩnh Hưng 📍 Bạn có thể đến trực tiếp hoặc gọi hotline 0987654321 để đặt hàng nhé!";
    }

    if (lowerMessage.includes('hotline') || lowerMessage.includes('phone')) {
      return "Hotline của Hạ Miên là 0987654321 📞 Chúng tôi phục vụ từ 8h sáng đến 8h tối hàng ngày. Bạn có thể gọi để được tư vấn và đặt hàng!";
    }

    // Default response
    return "Cảm ơn bạn đã liên hệ với Hạ Miên! 🌸 Tôi có thể giúp bạn tư vấn về hoa tươi, đặt hàng, hoặc tổ chức sự kiện. Bạn muốn hỗ trợ gì cụ thể ạ? Hoặc bạn có thể gọi hotline 0987654321 để được tư vấn trực tiếp!";
  }

  saveChatHistory() {
    try {
      localStorage.setItem('hamien_chat_history', JSON.stringify(this.chatHistory));
    } catch (error) {
      console.log("Could not save chat history:", error);
    }
  }

  loadChatHistory() {
    try {
      const saved = localStorage.getItem('hamien_chat_history');
      if (saved) {
        this.chatHistory = JSON.parse(saved);
      }
    } catch (error) {
      console.log("Could not load chat history:", error);
      this.chatHistory = [];
    }
  }

  // Method to configure AI API
  configureAI(apiKey, endpoint = null) {
    this.apiKey = apiKey;
    if (endpoint) {
      this.apiEndpoint = endpoint;
    }
  }

  // Method to clear chat history
  clearHistory() {
    this.chatHistory = [];
    localStorage.removeItem('hamien_chat_history');
    this.showWelcomeMessage();
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  window.hamienChatbot = new HaMienChatbot();
  
  // Optional: Configure AI API if you have one
  // window.hamienChatbot.configureAI('your-api-key-here');
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HaMienChatbot;
}

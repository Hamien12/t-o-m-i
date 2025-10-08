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
    this.dialogflow = { loaded: false, intents: {}, entities: {}, norm: (s)=>s };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadChatHistory();
    this.showWelcomeMessage();
    this.prepareNormalizer();
    this.loadDialogflowData();
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

    // Add welcome message (random from config if available)
    const config = window.CHATBOT_CONFIG || null;
    let welcomeText = "Xin chào! Tôi là chatbot của Hạ Miên 🌸 Tôi có thể giúp bạn tư vấn về các dịch vụ hoa tươi của chúng tôi. Bạn cần hỗ trợ gì ạ?";
    try {
      if (config && config.chatbot && Array.isArray(config.chatbot.welcomeMessages)) {
        const arr = config.chatbot.welcomeMessages;
        welcomeText = arr[Math.floor(Math.random() * arr.length)] || welcomeText;
      }
    } catch (e) {}
    this.addBotMessage(welcomeText);

    // Add suggestions
    this.addSuggestions();
  }

  addSuggestions() {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody) return;

    const config = window.CHATBOT_CONFIG || null;
    const suggestions = (config && config.chatbot && Array.isArray(config.chatbot.suggestions))
      ? config.chatbot.suggestions
      : [
      "Đặt hoa theo mẫu",
          "Tư vấn",
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

  prepareNormalizer() {
    // Simple VN diacritics normalizer
    const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ';
    const to   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIoooooooooooooooooUUUUUUUUUUUYYYYYD';
    const map = {};
    for (let i=0; i<from.length; i++) map[from[i]] = to[i];
    this.dialogflow.norm = (s) => (s || '').split('').map(ch => map[ch] || ch).join('').toLowerCase();
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

    // Rule-based responses
    setTimeout(() => {
      this.hideTypingIndicator(typingDiv);
      const responses = this.getRuleBasedResponses(message);
      responses.forEach(r => this.addBotMessage(r));
      // Show follow-up suggestions if any
      if (this.pendingSuggestions && this.pendingSuggestions.length) {
        this.renderCustomSuggestions(this.pendingSuggestions);
        this.pendingSuggestions = null;
      }
    }, 800 + Math.random() * 600);
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

  renderCustomSuggestions(list) {
    const chatBody = document.getElementById("chat-body");
    if (!chatBody || !Array.isArray(list) || !list.length) return;
    const suggestionsDiv = document.createElement("div");
    suggestionsDiv.className = "chat-suggestions";
    list.forEach(label => {
      const btn = document.createElement("button");
      btn.className = "suggest-btn";
      btn.textContent = label;
      suggestionsDiv.appendChild(btn);
    });
    chatBody.appendChild(suggestionsDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  getRuleBasedResponses(message) {
    const lower = this.dialogflow.norm(message || '');
    const cfg = window.CHATBOT_CONFIG || {};
    const intents = (cfg && cfg.intents) || {};
    const flows = (cfg && cfg.flows) || {};

    // 1) Try Dialogflow intents first if loaded
    if (this.dialogflow.loaded) {
      const matched = this.matchDialogflow(lower);
      if (matched && matched.responses && matched.responses.length) {
        // attach suggestions if configured
        const cfg = window.CHATBOT_CONFIG || {};
        const intentSugs = (cfg.intentSuggestions || {})[matched.name] || [];
        this.pendingSuggestions = intentSugs.length ? intentSugs : this.pendingSuggestions;
        return matched.responses;
      }
    }

    const matchIntent = () => {
      for (const key in intents) {
        const keywords = (intents[key] || []).map(this.dialogflow.norm);
        if (keywords.some(k => lower.includes(k))) return key;
      }
      return null;
    };

    const intent = matchIntent();
    let texts = [];

    if (intent && flows[intent]) {
      texts = flows[intent].text || [];
      this.pendingSuggestions = flows[intent].next || [];
    } else {
      texts = (flows.fallback && flows.fallback.text) || [
        'Cảm ơn bạn đã liên hệ với Hạ Miên! 🌸 Bạn muốn Miên hỗ trợ phần nào ạ?'
      ];
      this.pendingSuggestions = (flows.fallback && flows.fallback.next) || [];
    }

    return texts;
  }

  async loadDialogflowData() {
    try {
      const cfg = (window.CHATBOT_CONFIG || {});
      const manifest = Array.isArray(cfg.dialogflowManifest) ? cfg.dialogflowManifest : [];
      if (!Array.isArray(manifest) || manifest.length === 0) return;

      const loadOne = async (baseName) => {
        try {
          const intentRes = await fetch(`intents/${baseName}.json`);
          if (!intentRes.ok) return null;
          const intentJson = await intentRes.json();

          let phrases = [];
          const saysPath = `intents/${baseName}_usersays_en.json`;
          try {
            const saysRes = await fetch(saysPath);
            if (saysRes.ok) {
              const says = await saysRes.json();
              phrases = (says || []).map(item => {
                const text = (item?.data || []).map(d => (d.text || '')).join('');
                return text;
              }).filter(t => !!t && t.trim().length > 1);
            }
          } catch (_) {}

          const responses = [];
          const respBlocks = intentJson?.responses || [];
          respBlocks.forEach(block => {
            (block?.messages || []).forEach(msg => {
              if (Array.isArray(msg.speech)) {
                msg.speech.forEach(s => s && responses.push(s));
              } else if (typeof msg.speech === 'string') {
                responses.push(msg.speech);
              }
            });
          });

          // Collect entity hints from parameters
          const entityHints = new Set();
          respBlocks.forEach(block => {
            (block?.parameters || []).forEach(p => {
              const dt = (p?.dataType || '').toString();
              if (dt.startsWith('@') && !dt.startsWith('@sys.')) {
                entityHints.add(dt.slice(1));
              }
            });
          });
          // Also parse usersays meta to find entities used in examples
          try {
            const saysRes = await fetch(saysPath);
            if (saysRes.ok) {
              const says = await saysRes.json();
              (says || []).forEach(item => {
                (item?.data || []).forEach(d => {
                  const meta = (d?.meta || '').toString();
                  if (meta.startsWith('@') && !meta.startsWith('@sys.')) {
                    entityHints.add(meta.slice(1));
                  }
                });
              });
            }
          } catch(_) {}

          return { name: baseName, phrases, responses, entityHints: Array.from(entityHints) };
        } catch (_) { return null; }
      };

      const loaded = await Promise.all(manifest.map(loadOne));
      loaded.filter(Boolean).forEach(item => {
        this.dialogflow.intents[item.name] = item;
      });
      this.dialogflow.loaded = Object.keys(this.dialogflow.intents).length > 0;

      // Load entities: union of config list + entities referenced by intents
      const entSet = new Set();
      const entManifestCfg = Array.isArray(cfg.entitiesManifest) ? cfg.entitiesManifest : [];
      entManifestCfg.forEach(n => entSet.add(n));
      loaded.filter(Boolean).forEach(it => {
        (it.entityHints || []).forEach(n => entSet.add(n));
      });

      const loadEntity = async (baseName) => {
        try {
          const entRes = await fetch(`entities/${baseName}.json`);
          if (!entRes.ok) return null;
          const entJson = await entRes.json();
          const values = [];
          const entriesPath = `entities/${baseName}_entries_en.json`;
          try {
            const entriesRes = await fetch(entriesPath);
            if (entriesRes.ok) {
              const entries = await entriesRes.json();
              entries.forEach(e => {
                const v = (e?.value || '').toString();
                const syns = Array.isArray(e?.synonyms) ? e.synonyms : [];
                const pushSyn = (s) => {
                  const parts = (s || '').split(/[;,]/).map(p => p.trim()).filter(p => p.length > 1);
                  parts.forEach(p => values.push(this.dialogflow.norm(p)));
                };
                pushSyn(v);
                syns.forEach(s => pushSyn(s));
              });
            }
          } catch(_) {}
          return { name: baseName, values: Array.from(new Set(values)).filter(Boolean) };
        } catch(_) { return null; }
      };
      const ents = await Promise.all(Array.from(entSet).map(loadEntity));
      ents.filter(Boolean).forEach(e => { this.dialogflow.entities[e.name] = e.values; });
    } catch (e) {
      this.dialogflow.loaded = false;
    }
  }

  matchDialogflow(lowerMessage) {
    // naive contains match against training phrases
    const intents = this.dialogflow.intents || {};
    for (const key in intents) {
      const it = intents[key];
      if (!it) continue;
      const phraseHit = (it.phrases || []).some(p => {
        const np = this.dialogflow.norm(p);
        return np && (lowerMessage.includes(np) || np.includes(lowerMessage));
      });
      if (phraseHit) return it;
    }
    // try entity synonyms as weak signal (maps to broad intents)
    const ent = this.dialogflow.entities || {};
    const quickMap = [
      { ents: ['exinchao'], intent: 'ixinchao' },
      { ents: ['edonhang'], intent: 'idonhang' },
      { ents: ['edathoa','edathoaxemmau','edathoaxemmmautuvan'], intent: 'idathoa' },
      { ents: ['ephiship'], intent: 'iphiship' },
      { ents: ['edealhotheothang','edealhottheothang'], intent: 'idealhotthang10' }
    ];
    for (const m of quickMap) {
      const hit = m.ents.some(name => (ent[name]||[]).some(val => lowerMessage.includes(val)));
      if (hit && intents[m.intent]) return intents[m.intent];
    }
    return null;
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

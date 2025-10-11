// ==========================
// Dialogflow Data Loader for Hạ Miên Chatbot
// ==========================

class DialogflowLoader {
  constructor() {
    this.intents = {};
    this.entities = {};
    this.agent = null;
    this.loaded = false;
    this.cache = new Map(); // Cache for loaded data
    this.loadingPromise = null; // Prevent multiple simultaneous loads
  }

  // Load all Dialogflow data with caching and parallel loading
  async loadAllData() {
    // Return existing promise if already loading
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Check cache first
    const cached = this.loadFromCache();
    if (cached) {
      console.log('⚡ Đã tải dữ liệu từ cache!');
      return cached;
    }

    this.loadingPromise = this._loadAllDataInternal();
    return this.loadingPromise;
  }

  // Internal loading method
  async _loadAllDataInternal() {
    try {
      console.log('🔄 Đang tải dữ liệu Dialogflow...');
      const startTime = performance.now();
      
      // Load all data in parallel for maximum speed
      const [agentResult, intentsResult, entitiesResult] = await Promise.allSettled([
        this.loadAgent(),
        this.loadIntentsParallel(),
        this.loadEntitiesParallel()
      ]);
      
      this.loaded = true;
      const loadTime = performance.now() - startTime;
      
      console.log(`✅ Đã tải thành công dữ liệu Dialogflow trong ${loadTime.toFixed(0)}ms!`);
      console.log(`📊 Thống kê: ${Object.keys(this.intents).length} intents, ${Object.keys(this.entities).length} entities`);
      
      const result = {
        intents: this.intents,
        entities: this.entities,
        agent: this.agent,
        loaded: this.loaded
      };

      // Save to cache
      this.saveToCache(result);
      
      return result;
    } catch (error) {
      console.error('❌ Lỗi khi tải dữ liệu Dialogflow:', error);
      return null;
    } finally {
      this.loadingPromise = null;
    }
  }

  // Load agent configuration
  async loadAgent() {
    try {
      const response = await fetch('agent.json');
      if (response.ok) {
        this.agent = await response.json();
        console.log('✅ Đã tải agent.json');
      }
    } catch (error) {
      console.warn('⚠️ Không thể tải agent.json:', error);
    }
  }

  // Load all intents in parallel for speed
  async loadIntentsParallel() {
    const intentFiles = [
      'Default Fallback Intent',
      'Default Welcome Intent',
      'ichaohoi',
      'idathoa',
      'idealhot',
      'ihuydon',
      'iketthuc',
      'iphanhoitot',
      'iphanhoixau',
      'iphiship',
      'iPTTT',
      'ithongtinshop',
      'ithuthiep',
      'itracuudonhang',
      'ituvan - dichvu - decorsukien',
      'ituvan - dichvu - TGworkshop',
      'ituvan - dichvu - thietketheoyeucau',
      'ituvan - dichvu - TTworkshop',
      'ituvan - dichvu',
      'ituvan - sanpham - xemmau',
      'ituvan - sanpham',
      'ituvan'
    ];

    // Load all intents in parallel
    const intentPromises = intentFiles.map(intentName => 
      this.loadIntent(intentName).catch(error => {
        console.warn(`⚠️ Không thể tải intent ${intentName}:`, error);
        return null;
      })
    );

    const results = await Promise.all(intentPromises);
    
    // Process results
    results.forEach((intent, index) => {
      if (intent) {
        this.intents[intentFiles[index]] = intent;
      }
    });
  }

  // Legacy method for backward compatibility
  async loadIntents() {
    return this.loadIntentsParallel();
  }

  // Load single intent with parallel loading
  async loadIntent(intentName) {
    try {
      // Load intent configuration and user says in parallel
      const [intentResponse, userSaysResponse] = await Promise.allSettled([
        fetch(`intents/${intentName}.json`),
        fetch(`intents/${intentName}_usersays_vi.json`)
      ]);

      if (!intentResponse.value?.ok) return null;
      const intentData = await intentResponse.value.json();
      
      // Process user says
      let userSays = [];
      if (userSaysResponse.status === 'fulfilled' && userSaysResponse.value.ok) {
        const userSaysData = await userSaysResponse.value.json();
        userSays = userSaysData.map(item => {
          return (item.data || []).map(d => d.text || '').join('');
        }).filter(text => text.trim().length > 0);
      }

      // Extract responses
      const responses = [];
      const responseBlocks = intentData.responses || [];
      responseBlocks.forEach(block => {
        (block.messages || []).forEach(msg => {
          if (Array.isArray(msg.speech)) {
            msg.speech.forEach(s => s && responses.push(s));
          } else if (typeof msg.speech === 'string') {
            responses.push(msg.speech);
          }
        });
      });

      return {
        name: intentName,
        userSays: userSays,
        responses: responses,
        parameters: this.extractParameters(intentData),
        originalData: intentData
      };
    } catch (error) {
      console.warn(`⚠️ Lỗi khi tải intent ${intentName}:`, error);
      return null;
    }
  }

  // Extract parameters from intent
  extractParameters(intentData) {
    const parameters = [];
    const responseBlocks = intentData.responses || [];
    
    responseBlocks.forEach(block => {
      (block.parameters || []).forEach(param => {
        parameters.push({
          name: param.name,
          dataType: param.dataType,
          required: param.required || false,
          prompts: param.prompts || []
        });
      });
    });
    
    return parameters;
  }

  // Load all entities in parallel for speed
  async loadEntitiesParallel() {
    const entityFiles = [
      'ecacdip',
      'ecamon',
      'echaohoi',
      'edathoa',
      'edealhot',
      'edichvu',
      'edonhang',
      'ehotline',
      'ehuydon',
      'eloaihoa',
      'emasanpham',
      'emauhoa',
      'engaygio',
      'enoiban',
      'enoidatmua',
      'ephanhoitot',
      'ephanhoixau',
      'ephuongthucthanhtoan',
      'esanpham',
      'esoluong',
      'ethuthiep',
      'etuvan'
    ];

    // Load all entities in parallel
    const entityPromises = entityFiles.map(entityName => 
      this.loadEntity(entityName).catch(error => {
        console.warn(`⚠️ Không thể tải entity ${entityName}:`, error);
        return null;
      })
    );

    const results = await Promise.all(entityPromises);
    
    // Process results
    results.forEach((entity, index) => {
      if (entity) {
        this.entities[entityFiles[index]] = entity;
      }
    });
  }

  // Legacy method for backward compatibility
  async loadEntities() {
    return this.loadEntitiesParallel();
  }

  // Load single entity with parallel loading
  async loadEntity(entityName) {
    try {
      // Load entity configuration and entries in parallel
      const [entityResponse, entriesResponse] = await Promise.allSettled([
        fetch(`entities/${entityName}.json`),
        fetch(`entities/${entityName}_entries_vi.json`)
      ]);

      if (!entityResponse.value?.ok) return null;
      const entityData = await entityResponse.value.json();
      
      // Process entries
      let entries = [];
      if (entriesResponse.status === 'fulfilled' && entriesResponse.value.ok) {
        const entriesData = await entriesResponse.value.json();
        entries = entriesData.map(entry => ({
          value: entry.value,
          synonyms: entry.synonyms || []
        }));
      }

      return {
        name: entityName,
        entries: entries,
        isOverridable: entityData.isOverridable,
        isEnum: entityData.isEnum,
        isRegexp: entityData.isRegexp,
        automatedExpansion: entityData.automatedExpansion,
        allowFuzzyExtraction: entityData.allowFuzzyExtraction,
        originalData: entityData
      };
    } catch (error) {
      console.warn(`⚠️ Lỗi khi tải entity ${entityName}:`, error);
      return null;
    }
  }

  // Get intent by name
  getIntent(intentName) {
    return this.intents[intentName] || null;
  }

  // Get entity by name
  getEntity(entityName) {
    return this.entities[entityName] || null;
  }

  // Find matching intent based on user input
  findMatchingIntent(userInput, threshold = 0.3) {
    if (!userInput || typeof userInput !== 'string') {
      console.warn('⚠️ Invalid input for findMatchingIntent:', userInput);
      return null;
    }

    if (!this.loaded || !this.intents || Object.keys(this.intents).length === 0) {
      console.warn('⚠️ DialogflowLoader not loaded or no intents available');
      return null;
    }

    const normalizedInput = this.normalizeText(userInput);
    let bestMatch = { intent: null, score: 0 };

    for (const [intentName, intent] of Object.entries(this.intents)) {
      if (!intent || typeof intent !== 'object') {
        console.warn(`⚠️ Invalid intent data for ${intentName}:`, intent);
        continue;
      }

      let score = 0;
      
      // Check user says (training phrases)
      if (intent.userSays && Array.isArray(intent.userSays)) {
        for (const phrase of intent.userSays) {
          if (typeof phrase === 'string') {
            const normalizedPhrase = this.normalizeText(phrase);
            const similarity = this.calculateSimilarity(normalizedInput, normalizedPhrase);
            if (similarity > score) {
              score = similarity;
            }
          }
        }
      }

      // Check entity matches
      const entityScore = this.calculateEntityScore(normalizedInput, intent);
      score = Math.max(score, entityScore);

      if (score > bestMatch.score && score >= threshold) {
        bestMatch = { intent: intent, score: score };
      }
    }

    if (bestMatch.intent) {
      console.log(`✅ Found matching intent: ${bestMatch.intent.name} (score: ${bestMatch.score.toFixed(2)})`);
    } else {
      console.log(`⚠️ No matching intent found for: "${userInput}"`);
    }

    return bestMatch.intent;
  }

  // Calculate similarity between two texts
  calculateSimilarity(text1, text2) {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
          matches++;
          break;
        }
      }
    }
    
    return matches / Math.max(words1.length, words2.length);
  }

  // Calculate entity-based score
  calculateEntityScore(text, intent) {
    let score = 0;
    const parameters = intent.parameters || [];
    
    for (const param of parameters) {
      const entityName = param.dataType.replace('@', '');
      const entity = this.getEntity(entityName);
      
      if (entity) {
        for (const entry of entity.entries) {
          const normalizedValue = this.normalizeText(entry.value);
          if (text.includes(normalizedValue)) {
            score += 0.5;
          }
          
          // Check synonyms
          for (const synonym of entry.synonyms) {
            const normalizedSynonym = this.normalizeText(synonym);
            if (text.includes(normalizedSynonym)) {
              score += 0.3;
            }
          }
        }
      }
    }
    
    return Math.min(score, 1.0);
  }

  // Normalize Vietnamese text
  normalizeText(text) {
    if (!text) return '';
    
    const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ';
    const to   = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuuyyyyydAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIoooooooooooooooooUUUUUUUUUUUYYYYYD';
    
    let normalized = text.toLowerCase();
    for (let i = 0; i < from.length; i++) {
      normalized = normalized.replace(new RegExp(from[i], 'g'), to[i]);
    }
    
    return normalized.trim();
  }

  // Get random response from intent
  getRandomResponse(intent) {
    if (!intent || !intent.responses || intent.responses.length === 0) {
      return 'Xin lỗi, tôi không hiểu yêu cầu của bạn. Bạn có thể nói rõ hơn không ạ?';
    }
    
    const randomIndex = Math.floor(Math.random() * intent.responses.length);
    return intent.responses[randomIndex];
  }

  // Extract entities from user input
  extractEntities(userInput) {
    const normalizedInput = this.normalizeText(userInput);
    const extractedEntities = {};

    for (const [entityName, entity] of Object.entries(this.entities)) {
      for (const entry of entity.entries) {
        const normalizedValue = this.normalizeText(entry.value);
        if (normalizedInput.includes(normalizedValue)) {
          extractedEntities[entityName] = entry.value;
          break;
        }
        
        // Check synonyms
        for (const synonym of entry.synonyms) {
          const normalizedSynonym = this.normalizeText(synonym);
          if (normalizedInput.includes(normalizedSynonym)) {
            extractedEntities[entityName] = entry.value;
            break;
          }
        }
      }
    }

    return extractedEntities;
  }

  // Get conversation flow suggestions
  getConversationSuggestions(intent) {
    const suggestions = {
      'ichaohoi': ['Đặt hoa theo mẫu', 'Tư vấn', 'Thiết kế theo yêu cầu'],
      'idathoa': ['Thiết kế theo yêu cầu', 'Đặt hoa giao ngay', 'Tư vấn'],
      'idealhot': ['Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu'],
      'ituvan': ['Tư vấn', 'Đặt hoa theo mẫu'],
      'itracuudonhang': ['Hỏi về đơn hàng', 'CSKH sau mua'],
      'iphanhoitot': ['CSKH sau mua', 'Đặt hoa theo mẫu'],
      'iphanhoixau': ['CSKH sau mua', 'Tư vấn'],
      'ithuthiep': ['Thiết kế theo yêu cầu', 'Tư vấn'],
      'iphiship': ['Đặt hoa giao ngay', 'Hỏi về đơn hàng'],
      'iPTTT': ['Đặt hoa giao ngay', 'Hỏi về đơn hàng'],
      'ithongtinshop': ['Tư vấn', 'Đặt hoa theo mẫu'],
      'ihuydon': ['Hỏi về đơn hàng', 'CSKH sau mua'],
      'iketthuc': ['Tư vấn', 'Đặt hoa theo mẫu']
    };

    return suggestions[intent.name] || ['Tư vấn', 'Đặt hoa theo mẫu', 'Thiết kế theo yêu cầu'];
  }

  // Cache management methods
  saveToCache(data) {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        version: '1.0'
      };
      localStorage.setItem('hamien_dialogflow_cache', JSON.stringify(cacheData));
      console.log('💾 Đã lưu dữ liệu vào cache');
    } catch (error) {
      console.warn('⚠️ Không thể lưu cache:', error);
    }
  }

  loadFromCache() {
    try {
      const cached = localStorage.getItem('hamien_dialogflow_cache');
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const cacheAge = Date.now() - cacheData.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (cacheAge > maxAge) {
        localStorage.removeItem('hamien_dialogflow_cache');
        return null;
      }

      // Restore data
      this.intents = cacheData.data.intents;
      this.entities = cacheData.data.entities;
      this.agent = cacheData.data.agent;
      this.loaded = cacheData.data.loaded;

      return cacheData.data;
    } catch (error) {
      console.warn('⚠️ Không thể đọc cache:', error);
      return null;
    }
  }

  clearCache() {
    try {
      localStorage.removeItem('hamien_dialogflow_cache');
      console.log('🗑️ Đã xóa cache');
    } catch (error) {
      console.warn('⚠️ Không thể xóa cache:', error);
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DialogflowLoader;
}

// Make available globally
window.DialogflowLoader = DialogflowLoader;

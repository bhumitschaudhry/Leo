import { GoogleGenerativeAI } from "@google/generative-ai";

const chatContainer = document.getElementById('chat-container');
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModal = document.getElementById('close-modal');
const customDropdown = document.getElementById('custom-theme-dropdown');
const selectedThemeText = document.getElementById('selected-theme-text');
const dropdownOptions = customDropdown.querySelector('.dropdown-options');
const apiKeyInput = document.getElementById('api-key-input');
const saveSettingsBtn = document.getElementById('save-settings');

// Initialize State
let currentTheme = localStorage.getItem('theme') || 'light';
let customApiKey = localStorage.getItem('apiKey') || '';

// Apply Initial state to controls
updateDropdownUI(currentTheme);
apiKeyInput.value = customApiKey;

// Theme Toggle (Icon)
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
});

// Custom Dropdown Logic
customDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    customDropdown.classList.toggle('active');
});

dropdownOptions.addEventListener('click', (e) => {
    const option = e.target.closest('.option');
    if (option) {
        currentTheme = option.dataset.value;
        applyTheme(currentTheme);
        customDropdown.classList.remove('active');
    }
});

// Close dropdown on outside click
window.addEventListener('click', () => {
    customDropdown.classList.remove('active');
});

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateDropdownUI(theme);
}

function updateDropdownUI(theme) {
    selectedThemeText.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    // Update selected class in options
    dropdownOptions.querySelectorAll('.option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.value === theme);
    });
}

// Modal Logic
settingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

saveSettingsBtn.addEventListener('click', () => {
    customApiKey = apiKeyInput.value.trim();
    localStorage.setItem('apiKey', customApiKey);
    settingsModal.style.display = 'none';
    alert('Settings saved!');
});

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

// Handle send on Enter
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    userInput.value = '';
    userInput.style.height = 'auto';
    userInput.disabled = true;
    sendBtn.disabled = true;

    appendMessage('user', message);
    const typingId = showTypingIndicator();

    try {
        let responseText = '';

        if (customApiKey) {
            // Direct Browser Call (BYOK)
            const genAI = new GoogleGenerativeAI(customApiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: "You are Leo, a helpful and concise AI assistant. Your goal is to provide clear, accurate, and brief responses to user queries."
            });
            const result = await model.generateContent(message);
            const response = await result.response;
            responseText = response.text();
        } else {
            // Backend Fallback
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            responseText = data.response;
        }

        removeTypingIndicator(typingId);
        appendMessage('ai', responseText);
    } catch (error) {
        removeTypingIndicator(typingId);
        appendMessage('ai', 'Error: ' + error.message);
        console.error('Chat error:', error);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        userInput.focus();
    }
}

function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    const id = 'typing-' + Date.now();
    typingDiv.id = id;
    typingDiv.classList.add('message', 'ai-message');
    typingDiv.innerHTML = `
        <div class="typing">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
    return id;
}

function removeTypingIndicator(id) {
    const typingDiv = document.getElementById(id);
    if (typingDiv) typingDiv.remove();
}

function scrollToBottom() {
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth'
    });
}

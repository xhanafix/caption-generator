class ApiKeyManager {
    static getApiKey() {
        return localStorage.getItem('openRouterApiKey');
    }

    static saveApiKey(apiKey) {
        localStorage.setItem('openRouterApiKey', apiKey);
    }
}

function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value;
    if (apiKey) {
        ApiKeyManager.saveApiKey(apiKey);
        document.getElementById('apiSection').style.display = 'none';
        alert('API Key saved successfully!');
    }
}

function updateProgress(percent, message) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const progressContainer = document.getElementById('progressContainer');
    
    progressContainer.style.display = 'block';
    progressBar.style.width = `${percent}%`;
    progressText.textContent = message;
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

async function generateCaptions() {
    const apiKey = ApiKeyManager.getApiKey();
    if (!apiKey) {
        alert('Please enter your API key first!');
        return;
    }

    const topic = document.getElementById('topic').value;
    const tone = document.getElementById('toneSelect').value;

    if (!topic) {
        alert('Please enter a topic!');
        return;
    }

    const generateButton = document.getElementById('generateButton');
    generateButton.disabled = true;
    updateProgress(0, 'Initializing...');

    const platforms = ['facebook', 'twitter', 'instagram', 'pinterest'];
    
    platforms.forEach(platform => {
        document.getElementById(`${platform}Caption`).value = '';
    });

    try {
        updateProgress(20, 'Preparing prompt...');
        const prompt = `Create a tailored social media caption based on the title: "${topic}" in a ${tone} tone.

Generate distinct captions for Facebook, Twitter, Instagram, and Pinterest, with these requirements:

Facebook:
- Engaging and detailed (up to 400 characters)
- Include 1-2 relevant emojis
- Focus on storytelling
- End with a question or call-to-action

Twitter:
- Concise and impactful (max 280 characters)
- Include 1-2 relevant emojis
- Use 2-3 relevant hashtags
- Include a clear call-to-action

Instagram:
- Engaging and visually descriptive
- Use line breaks for readability
- Include 5-7 relevant hashtags
- Use 2-3 relevant emojis
- End with a question or call-to-action

Pinterest:
- Descriptive and keyword-rich
- Include 2-3 relevant hashtags
- Focus on benefits or solutions
- Clear call-to-action

Format the response as:
[FACEBOOK]
(facebook caption here)

[TWITTER]
(twitter caption here)

[INSTAGRAM]
(instagram caption here)

[PINTEREST]
(pinterest caption here)`;

        updateProgress(40, 'Sending request...');
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.href,
                "X-Title": "Social Media Caption Generator",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/learnlm-1.5-pro-experimental:free",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ]
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 1000
            })
        });

        updateProgress(60, 'Processing response...');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateProgress(80, 'Formatting captions...');
        
        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response structure from API');
        }

        const captions = data.choices[0].message.content;
        const captionSections = captions.split('[');
        
        let captionsFound = false;
        
        platforms.forEach(platform => {
            const section = captionSections.find(s => s.toLowerCase().startsWith(platform.toLowerCase()));
            if (section) {
                const caption = section.split(']')[1].trim();
                document.getElementById(`${platform}Caption`).value = caption;
                captionsFound = true;
            }
        });

        if (!captionsFound) {
            throw new Error('No captions found in the response');
        }

        updateProgress(100, 'Completed!');
        setTimeout(() => {
            document.getElementById('progressContainer').style.display = 'none';
        }, 1000);

    } catch (error) {
        console.error('Error generating captions:', error);
        const errorMessage = error.message || 'Unknown error occurred';
        
        updateProgress(100, `Error: ${errorMessage}`);
        platforms.forEach(platform => {
            document.getElementById(`${platform}Caption`).value = 
                `Error generating caption: ${errorMessage}\nPlease try again or check your API key.`;
        });
    } finally {
        generateButton.disabled = false;
    }
}

function copyContent(elementId) {
    const textarea = document.getElementById(elementId);
    textarea.select();
    document.execCommand('copy');
    alert('Caption copied to clipboard!');
}

function clearApiKey() {
    if (confirm('Are you sure you want to clear your API key?')) {
        localStorage.removeItem('openRouterApiKey');
        document.getElementById('apiKey').value = '';
        document.getElementById('apiSection').style.display = 'block';
        alert('API Key cleared successfully!');
    }
}

window.onload = function() {
    const savedApiKey = ApiKeyManager.getApiKey();
    if (savedApiKey) {
        document.getElementById('apiSection').style.display = 'none';
        document.getElementById('apiKey').value = savedApiKey;
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.getElementById('themeToggle').checked = savedTheme === 'dark';
    
    document.getElementById('themeToggle').addEventListener('change', toggleTheme);
} 
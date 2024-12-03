let OPENROUTER_API_KEY = '';
const SITE_URL = window.location.origin;
const SITE_NAME = 'Social Media Caption Generator';

function saveApiKey() {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (apiKey) {
        OPENROUTER_API_KEY = apiKey;
        alert('API key saved successfully!');
    } else {
        alert('Please enter a valid API key');
    }
}

function copyToClipboard(elementId) {
    const textarea = document.getElementById(elementId);
    textarea.select();
    document.execCommand('copy');
    alert('Copied to clipboard!');
}

async function generateCaptions() {
    if (!OPENROUTER_API_KEY) {
        alert('Please enter your API key first');
        return;
    }

    const contentUrl = document.getElementById('contentUrl').value.trim();
    if (!contentUrl) {
        alert('Please enter a content URL');
        return;
    }

    const generateButton = document.querySelector('.input-section button');
    generateButton.disabled = true;
    generateButton.textContent = 'Generating...';

    const platforms = ['facebook', 'twitter', 'pinterest', 'instagram'];
    for (const platform of platforms) {
        try {
            const caption = await generateCaption(contentUrl, platform);
            document.getElementById(`${platform}Caption`).value = caption;
            updateCharCount(`${platform}Caption`, platform);
        } catch (error) {
            console.error(`Error generating ${platform} caption:`, error);
            document.getElementById(`${platform}Caption`).value = `Error: ${error.message}`;
        }
    }

    generateButton.disabled = false;
    generateButton.textContent = 'Generate Captions';
}

async function generateCaption(url, platform) {
    const platformLimits = {
        facebook: 63206,
        twitter: 280,
        pinterest: 500,
        instagram: 2200
    };

    const prompt = `Generate a compelling ${platform} caption for the content at ${url}. 
    The total caption MUST be under ${platformLimits[platform]} characters.
    
    Format:
    - Start with an attention-grabbing hook
    - Follow with a brief engaging message
    - End with ${getHashtagRequirements(platform)}
    
    Platform considerations:
    ${getPlatformSpecifics(platform)}
    
    IMPORTANT: Keep it concise and ensure the TOTAL response is under ${platformLimits[platform]} characters.`;

    updateProgress(platform, 30); // Start progress

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": SITE_URL,
            "X-Title": SITE_NAME,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "google/learnlm-1.5-pro-experimental:free",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        })
    });

    updateProgress(platform, 70); // Update progress

    if (!response.ok) {
        throw new Error('Failed to generate caption');
    }

    const data = await response.json();
    let caption = data.choices[0].message.content;
    
    if (caption.length > platformLimits[platform]) {
        caption = caption.substring(0, platformLimits[platform]);
    }
    
    updateProgress(platform, 100); // Complete progress
    setTimeout(() => hideProgress(platform), 1000); // Hide progress bar after 1 second
    
    return caption;
}

function getHooklineLength(platform) {
    switch (platform) {
        case 'facebook':
            return 100;
        case 'twitter':
            return 50;
        case 'pinterest':
            return 80;
        default:
            return 50;
    }
}

function getBodyLength(platform) {
    switch (platform) {
        case 'facebook':
            return 1000;
        case 'twitter':
            return 150;
        case 'pinterest':
            return 300;
        default:
            return 150;
    }
}

function getCTALength(platform) {
    switch (platform) {
        case 'facebook':
            return 100;
        case 'twitter':
            return 30;
        case 'pinterest':
            return 50;
        default:
            return 30;
    }
}

function getHashtagRequirements(platform) {
    switch (platform) {
        case 'facebook':
            return "2-3 relevant hashtags";
        case 'twitter':
            return "1-2 impactful hashtags";
        case 'pinterest':
            return "4-5 relevant hashtags";
        case 'instagram':
            return "8-15 relevant hashtags";
        default:
            return "";
    }
}

function getPlatformSpecifics(platform) {
    switch (platform) {
        case 'facebook':
            return "- Maximum length: 63,206 characters\n" +
                   "- Optimal length: 100-250 characters\n" +
                   "- Use 2-3 relevant hashtags\n" +
                   "- Focus on storytelling";
        case 'twitter':
            return "- Maximum length: 280 characters\n" +
                   "- Include spaces for hashtags and links\n" +
                   "- Use 1-2 impactful hashtags\n" +
                   "- Be concise and punchy";
        case 'pinterest':
            return "- Maximum length: 500 characters\n" +
                   "- Focus on descriptive keywords\n" +
                   "- Use 4-5 relevant hashtags\n" +
                   "- Include detailed information about the content";
        case 'instagram':
            return "- Maximum length: 2,200 characters\n" +
                   "- Use line breaks for readability\n" +
                   "- Include 8-15 relevant hashtags\n" +
                   "- Focus on engaging storytelling";
        default:
            return "";
    }
}

// Add progress bar functionality
function updateProgress(platform, percentage) {
    const progressBar = document.getElementById(`${platform}Progress`);
    const progressContainer = document.getElementById(`${platform}ProgressContainer`);
    
    if (progressContainer) {
        progressContainer.style.display = 'block';
    }
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

function hideProgress(platform) {
    const progressContainer = document.getElementById(`${platform}ProgressContainer`);
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
}

// Modify updateCharCount function to remove character count display
function updateCharCount(elementId, platform) {
    const textarea = document.getElementById(elementId);
    const text = textarea.value;
    const platformLimits = {
        facebook: 63206,
        twitter: 280,
        pinterest: 500,
        instagram: 2200
    };
    
    const charCount = text.length;
    const limit = platformLimits[platform];
    
    // Only trim text if it exceeds the limit
    if (charCount > limit) {
        textarea.value = text.substring(0, limit);
    }
} 

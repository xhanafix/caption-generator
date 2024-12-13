# Social Media Caption Generator

A powerful web-based tool that generates optimized captions for multiple social media platforms using AI. Built with HTML, CSS, and JavaScript, this application leverages the OpenRouter API to create engaging, platform-specific content.

![Social Media Caption Generator](screenshot.png)

## Features

- 🎯 Platform-specific captions for:
  - Facebook
  - Twitter
  - Instagram
  - Pinterest
- 🎨 Dark/Light theme support
- 📱 Responsive design for all devices
- 💾 Local storage for API key management
- 🔄 Real-time generation progress indicator
- 📋 One-click copy functionality
- 🎭 Multiple tone options:
  - Professional
  - Casual
  - Friendly
  - Authoritative

## Demo

[Live Demo](your-demo-link-here)

## Prerequisites

To use this application, you'll need:

1. An OpenRouter API key (get it from [OpenRouter](https://openrouter.ai/))
2. A modern web browser
3. Internet connection

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/social-media-caption-generator.git
```

2. Navigate to the project directory:
```bash
cd social-media-caption-generator
```

3. Open `index.html` in your web browser or set up a local server.

## Usage

1. Enter your OpenRouter API key (only needed once)
2. Input your topic or title
3. Select your preferred tone
4. Click "Generate Captions"
5. Copy the generated captions for each platform

## Configuration

The application uses the following OpenRouter AI model:
- Model: `google/learnlm-1.5-pro-experimental:free`
- Temperature: 0.7
- Max Tokens: 1000

You can modify these settings in `blogGenerator.js` if needed.

## API Reference

This project uses the OpenRouter API. The request format is:

```javascript
{
    "model": "google/learnlm-1.5-pro-experimental:free",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "your prompt here"
                }
            ]
        }
    ]
}
```

## File Structure

```
├── index.html           # Main HTML file
├── styles.css          # Styling and theme management
├── blogGenerator.js    # Core functionality and API integration
└── README.md          # Project documentation
```

## Features in Detail

### Caption Generation
- Optimized for each platform's requirements
- Character limit compliance
- Platform-specific hashtag recommendations
- Emoji integration
- Call-to-action suggestions

### User Interface
- Progress indicator during generation
- Dark/Light theme toggle
- Responsive design
- Copy-to-clipboard functionality
- Error handling with user feedback

### Security
- Secure API key storage
- Option to clear stored credentials
- No server-side storage of sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenRouter API for providing the AI capabilities
- Contributors and testers who helped improve the project

## Support

For support, please open an issue in the GitHub repository or contact [your-email@example.com]

## Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [your-website.com](https://your-website.com)

---

Made with ❤️ by [Your Name]
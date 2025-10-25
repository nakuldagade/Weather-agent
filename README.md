# 🌤️ Weather Agent Chat

A modern weather chat application built with Next.js, React, and TypeScript. Get real-time weather information through an AI-powered weather agent.

## Delpoyment Link:  https://weather-agent-chat-8cj7.vercel.app/

## ✨ Features

- 🤖 **AI Weather Agent**: Powered by Mastra Cloud weather agent
- 💬 **Real-time Chat**: Streaming weather responses
- 🌙 **Dark/Light Theme**: Toggle between themes
- 📱 **Mobile-First**: Optimized for mobile devices
- 🔊 **Sound Notifications**: Audio feedback for messages
- 📝 **Chat History**: Save and manage conversations
- 🔄 **Retry Mechanism**: Retry failed requests
- 📤 **Export**: Export chat history as text files
<img width="1466" height="875" alt="Screenshot 2025-10-10 at 1 54 13 AM" src="https://github.com/user-attachments/assets/5af8cc41-2755-4daa-bc17-8af00bf1ce48" />

<img width="2932" height="1748" alt="image" src="https://github.com/user-attachments/assets/2e46d550-557b-4931-9659-6fdb950ed96b" />


## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pravesh03/weather-agent-chat.git
   cd weather-agent-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

The application uses the Mastra Cloud weather agent API:

```typescript
const API_URL = 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream'
const THREAD_ID = '60002220086' // Your college roll number
```

## 📱 Mobile-First Design

- **Touch-optimized**: 44px minimum touch targets
- **Responsive layout**: Works on all screen sizes
- **Safe area support**: Handles device notches
- **Smooth animations**: Optimized for mobile performance

## 🧪 Testing

Test the application with these scenarios:

1. **Basic Interaction**: Send "What's the weather in London?"
2. **Error Handling**: Disconnect internet and send message
3. **Multiple Messages**: Send several weather queries
4. **Edge Cases**: Very long messages, empty messages, special characters


## 🔍 Troubleshooting

### Common Issues

1. **API Not Found Error**: Verify the API endpoint is correct
2. **First Request Not Working**: Check browser console for errors
3. **Styling Issues**: Ensure Tailwind CSS is properly configured
4. **Sound Not Working**: Check browser audio permissions

## 📚 API Documentation

### Request Format
```json
{
  "messages": [{"role": "user", "content": "Your message"}],
  "runId": "weatherAgent",
  "maxRetries": 2,
  "maxSteps": 5,
  "temperature": 0.5,
  "topP": 1,
  "runtimeContext": {},
  "threadId": "60002220086",
  "resourceId": "weatherAgent"
}
```

### Response Format
The API returns streaming data in multiple formats:
- SSE format: `data: {"type": "text", "content": "..."}`
- Direct streaming: `0:"text content"`
- Metadata: `f:{"messageId": "..."}`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Mastra Cloud for the weather agent API
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework

---

**Happy Weather Chatting! 🌤️**
# Weather-agent-chat
# Weather-agent
# Weather-agent
# Weather-agent

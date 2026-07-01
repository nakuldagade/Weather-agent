# 🌤️ Weather Agent

A modern weather chat application built with Next.js, React, and TypeScript. Get real-time weather information through an AI-powered weather agent.

## Deployment Link:  https://weather-agent-three-tan.vercel.app/

## ✨ Features

- 🤖 **AI Weather Agent**: Powered by Open-Meteo free weather API
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
   git clone https://github.com/nakuldagade/weather-agent-chat.git
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

The application uses the [Open-Meteo](https://open-meteo.com/) free weather API (no API key required):

```typescript
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'
```

The API route (`/api/chat`) handles:
1. Extracting the city name from the user's message
2. Geocoding the city to latitude/longitude via Open-Meteo Geocoding API
3. Fetching current weather data (temperature, humidity, wind, conditions)

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
  "messages": [{"role": "user", "content": "What is the weather in London?"}]
}
```

### Response Format
The API returns a JSON object with the weather reply:
```json
{
  "reply": "**Weather in London, England, United Kingdom** ☀️\n\n🌡️ **Temperature:** 23°C\n🤔 **Feels Like:** 21.8°C\n🌤️ **Condition:** Overcast ☁️\n💧 **Humidity:** 47%\n💨 **Wind:** 10.8 km/h NW"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for the free weather API
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework

---

**Happy Weather Chatting! 🌤️**

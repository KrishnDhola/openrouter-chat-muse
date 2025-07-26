# OpenRouter Chat Muse - Setup Guide

A beautiful ChatGPT-like web application built with React, TypeScript, and the Matsu theme, powered by OpenRouter's free AI models.

## 🚀 Features

- **ChatGPT-like Interface**: Clean, modern chat interface with message bubbles
- **30+ Free AI Models**: Access to various free models via OpenRouter API
- **Conversation Management**: Create, save, edit, and export conversations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Matsu Theme**: Beautiful design system with custom shadows and typography
- **Real-time Typing Indicators**: Visual feedback during AI responses
- **Model Selection**: Switch between different AI models in real-time
- **Local Storage**: Conversations are saved locally and persist between sessions
- **Export Functionality**: Download conversations as JSON files

## 🎨 Design System

The application uses the **Matsu theme** which includes:
- Custom typography with PT Serif for headings and Nunito for body text
- Beautiful shadow effects and borders
- Carefully crafted color palette
- Responsive grid system
- Custom component variants

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Matsu Theme
- **UI Components**: shadcn/ui with custom variants
- **API Integration**: OpenRouter API for AI models
- **State Management**: Custom React hooks
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📱 Supported Models

The application supports 30+ free AI models including:

- **Meta Llama Models**: Llama 4 Maverick, Llama 4 Scout, Llama 3.1 Nemotron
- **DeepSeek Models**: DeepSeek Chat, DeepSeek R1, DeepSeek V3
- **Google Models**: Gemini 2.5 Pro, Gemini 2.0 Flash
- **Mistral Models**: Mistral Small 3.1 24B
- **Qwen Models**: Qwen 2.5 VL, Qwen 3 8B
- **And many more...**

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- OpenRouter API key (already configured in the app)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd openrouter-chat-muse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### API Configuration

The OpenRouter API key is already configured in the application. If you need to use your own API key:

1. Get your API key from [OpenRouter](https://openrouter.ai/)
2. Update the `OPENROUTER_API_KEY` in `src/services/openrouter.ts`

## 🎯 Usage Guide

### Starting a Conversation
1. Click "New Chat" or start typing in the input field
2. Select your preferred AI model from the dropdown
3. Type your message and press Enter to send

### Managing Conversations
- **New Chat**: Click the "New Chat" button in the header or sidebar
- **Switch Conversations**: Click on any conversation in the sidebar
- **Edit Title**: Click the edit icon next to a conversation title
- **Export**: Click the download icon to export as JSON
- **Delete**: Click the trash icon to delete a conversation

### Keyboard Shortcuts
- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Escape**: Cancel editing conversation title

### Model Selection
- Use the dropdown in the header to switch between AI models
- Each model has different capabilities and response styles
- Model information is shown with each message

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components with Matsu variants
│   ├── chat/         # Chat-specific components
│   └── Layout.tsx    # Main layout with texture overlay
├── hooks/
│   └── useChat.ts    # Main chat state management
├── services/
│   └── openrouter.ts # OpenRouter API integration
├── types/
│   └── chat.ts       # TypeScript type definitions
├── pages/            # Route components
└── index.css         # Matsu theme design system
```

## 🎨 Customization

### Theme Customization
The Matsu theme is defined in `src/index.css`. You can customize:
- Color palette (HSL values)
- Typography (font families and weights)
- Shadows and effects
- Border radius and spacing

### Component Variants
Components use the design system tokens. To add new variants:
1. Update the CSS variables in `index.css`
2. Add new component variants in `src/components/ui/`
3. Use semantic naming for consistency

### Adding New Models
To add new AI models:
1. Update the `FREE_MODELS` array in `src/services/openrouter.ts`
2. Ensure the model ID is correct and supports the OpenRouter API

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Lovable
1. Open your project in Lovable
2. Click the "Publish" button
3. Your app will be live at your Lovable URL

### Custom Domain
1. Go to Project > Settings > Domains in Lovable
2. Connect your custom domain
3. Follow the DNS configuration instructions

## 🔒 Security & Privacy

- **API Keys**: The OpenRouter API key is client-side (safe for public use)
- **Data Storage**: All conversations are stored locally in your browser
- **Privacy**: No data is sent to external servers except OpenRouter API calls
- **Export**: You can export and backup your conversation data

## 🐛 Troubleshooting

### Common Issues

1. **API Errors**: Check your internet connection and OpenRouter API status
2. **Model Unavailable**: Some models may be temporarily unavailable
3. **Storage Full**: Clear browser storage if you have too many conversations
4. **Slow Responses**: Try switching to a different AI model

### Error Handling
The app includes comprehensive error handling:
- Network errors are displayed with retry options
- Model errors show specific error messages
- Rate limiting is handled gracefully

## 📚 Additional Resources

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Matsu Theme Repository](https://github.com/HMarzban/daisyui-matsu-theme)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy chatting with AI!** 🤖✨
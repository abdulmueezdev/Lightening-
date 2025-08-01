# Storm Watch Sky

A comprehensive weather and lightning tracking web application built with React, TypeScript, Express.js, and Mapbox.

![Storm Watch Sky Dashboard](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Storm+Watch+Sky+Dashboard)

## 🌟 Features

### Real-time Lightning Tracking
- Live lightning strike visualization with intensity-based color coding
- Pulsing animations for enhanced visibility
- Automatic cleanup of old lightning data
- Interactive markers with location details

### Interactive Weather Maps
- **Lightning Layer**: Real-time lightning strikes with intensity indicators
- **Weather Layer**: Temperature zones for major cities
- **Radar Layer**: Simulated precipitation areas
- Dark theme optimized map interface

### Weather Monitoring
- Current weather conditions (temperature, humidity, wind speed, visibility)
- City search with autocomplete functionality
- Geolocation support for current location weather
- Real-time weather data updates

### User Interface
- Modern dark/light theme with seamless toggle
- Responsive design for desktop and mobile
- Connection status indicators
- Lightning alert notifications
- Collapsible sidebar layout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Mapbox API key
- OpenWeatherMap API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/storm-watch-sky.git
cd storm-watch-sky
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys:
VITE_MAPBOX_API_KEY=your_mapbox_api_key_here
VITE_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components with shadcn/ui
- **TanStack Query** for state management
- **Wouter** for client-side routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- RESTful API design
- In-memory storage with planned PostgreSQL migration

### External Services
- **Mapbox GL JS** for interactive maps
- **OpenWeatherMap API** for weather data
- **Geolocation API** for location services

## 🗺️ Map Layers

### Lightning Layer
- Real-time lightning strike visualization
- Color-coded intensity levels (yellow → orange → red)
- Pulsing animations for active strikes
- Auto-refresh every 10 seconds

### Weather Layer
- Temperature zones for major cities
- Color-coded temperature ranges:
  - 🔵 Blue: Cold (0-15°C)
  - 🟢 Green: Mild (15-25°C)
  - 🟡 Yellow: Warm (25-35°C)
  - 🔴 Red: Hot (35°C+)

### Radar Layer
- Simulated precipitation areas
- Light to heavy precipitation intensity
- Interactive overlay visualization

## 📱 Features in Detail

### Lightning Alerts
- Real-time strike notifications
- Intensity-based severity levels
- Location-aware alerts
- Configurable sound notifications

### City Search
- Autocomplete city suggestions
- Global city database
- Coordinate-based location selection
- Current location detection

### Weather Data
- Temperature and feels-like temperature
- Humidity and visibility metrics
- Wind speed and direction
- Real-time data updates

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript checks
```

### Project Structure
```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── lib/         # Utility functions
│   │   └── hooks/       # Custom React hooks
├── server/          # Backend Express application
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API routes
│   └── storage.ts   # Data storage layer
├── shared/          # Shared TypeScript schemas
└── README.md
```

## 🎨 Theming

The application supports both light and dark themes with:
- Automatic system theme detection
- Manual theme toggle
- Persistent theme preference
- Comprehensive dark mode styling

## 🌐 Deployment

### Environment Variables
Required for production:
- `VITE_MAPBOX_API_KEY`: Mapbox API key for maps
- `VITE_OPENWEATHERMAP_API_KEY`: OpenWeatherMap API key

### Build Process
```bash
npm run build
```

Builds the app for production to the `dist` folder.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mapbox** for the incredible mapping platform
- **OpenWeatherMap** for reliable weather data
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling

## 📞 Support

For support, email support@stormwatchsky.com or join our Discord community.

---

Built with ❤️ using modern web technologies
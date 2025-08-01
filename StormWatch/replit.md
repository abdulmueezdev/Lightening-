# Storm Watch Sky - Weather Monitoring Application

## Overview

Storm Watch Sky is a real-time weather monitoring application that provides lightning alerts, weather data, and interactive mapping capabilities. The application features a modern dashboard interface with live weather updates and lightning strike tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**July 30, 2025:**
- Fixed lightning alerts scrolling with max height and 20 strike limit
- Repositioned time display under intensity bars in HH:MM:SS format  
- Created complete GitHub setup with documentation
- Added .env.example template for easy project setup
- Project ready for GitHub upload and sharing

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API endpoints for weather and lightning data
- **Development**: Hot module replacement via Vite integration

### Data Management
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared TypeScript schemas using Zod for validation
- **Storage**: In-memory storage implementation for lightning strikes with planned database migration

## Key Components

### Weather Services
- **OpenWeatherMap Integration**: Real-time weather data fetching
- **City Search**: Autocomplete functionality for location selection
- **Geolocation Support**: Browser-based location detection
- **Weather Display**: Temperature, humidity, wind speed, and visibility metrics

### Lightning Monitoring
- **Real-time Tracking**: Lightning strike data with intensity measurements
- **Alert System**: Live notifications with configurable sound alerts
- **Data Retention**: Automatic cleanup of old lightning data
- **Visual Indicators**: Intensity bars and timestamp formatting

### Mapping System
- **Mapbox Integration**: Interactive maps with dark theme
- **Layer Management**: Weather radar, lightning, and satellite overlays
- **Navigation Controls**: Zoom, pan, and location services
- **Real-time Updates**: Live data visualization on map interface

### User Interface
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Sidebar Layout**: Collapsible sidebar with weather information and alerts
- **Theme System**: Light/dark mode support with CSS custom properties
- **Component Library**: Comprehensive UI components from Radix UI

## Data Flow

1. **Weather Data**: Client requests → Express API → OpenWeatherMap API → Response with validated data
2. **Lightning Data**: In-memory storage → Periodic cleanup → Real-time client updates via polling
3. **City Search**: User input → Debounced API calls → Autocomplete suggestions
4. **Map Interactions**: User actions → Mapbox GL JS → Coordinate updates → Weather data refresh

## External Dependencies

### APIs and Services
- **OpenWeatherMap**: Weather data and city search functionality
- **Mapbox**: Interactive mapping and geolocation services
- **Neon Database**: Serverless PostgreSQL hosting

### Key Libraries
- **Frontend**: React, TanStack Query, Radix UI, Tailwind CSS, Wouter
- **Backend**: Express.js, Drizzle ORM, Zod validation, Axios
- **Development**: Vite, TypeScript, ESBuild

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle Kit handles schema migrations

### Environment Configuration
- **Development**: Hot reload with Vite dev server and Express proxy
- **Production**: Static file serving with Express backend
- **Environment Variables**: Database URL, API keys for external services

### Database Strategy
- **Current**: In-memory storage for development and testing
- **Planned**: PostgreSQL migration using existing Drizzle configuration
- **Schema**: Defined in `shared/schema.ts` for type safety across frontend and backend

The application is structured as a monorepo with clear separation between client, server, and shared code, enabling efficient development and deployment workflows.
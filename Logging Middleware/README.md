# URL Shortener with Logging Middleware

A React-based URL shortener application with integrated logging middleware and analytics capabilities.

## Project Structure

The project is organized into two main components:

### 1. Frontend Test Submission
Contains the React application for URL shortening and analytics:
- URL shortening with custom shortcodes
- Statistics tracking for shortened URLs
- Material UI-based responsive design
- Local storage for data persistence

### 2. Logging Middleware
A standalone logging service that:
- Sends logs to evaluation service
- Supports multiple log levels (debug, info, warn, error, fatal)
- Categorizes logs by package types (api, component, hook, page, state, style)

## Features

### URL Shortener
- Shorten up to 5 URLs simultaneously
- Optional custom shortcode support
- 30-minute default validity period
- Copy-to-clipboard functionality
- Responsive design for all devices

### Analytics Dashboard
- Track clicks on shortened URLs
- Capture location and referrer information
- View statistics in a user-friendly table

### Logging System
- Centralized logging through middleware
- API endpoint: http://20.244.56.144/evaluation-service/logs
- Structured logging with package categorization
- Multiple severity levels for better debugging

## Setup Instructions

1. Install Dependencies:
```bash
cd frontend
npm install
```

2. Start Development Server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Technical Stack

- React.js
- Material UI
- Local Storage for data persistence
- Custom logging middleware
- React Router for navigation

## Project Guidelines

- All shortened URLs have a default validity of 30 minutes
- Custom shortcodes must be unique
- Logging follows specific package naming conventions
- Data persists across browser sessions using localStorage

## API Documentation

### Logging Middleware
- Endpoint: http://20.244.56.144/evaluation-service/logs
- Method: POST
- Package Categories: api, component, hook, page, state, style
- Log Levels: debug, info, warn, error, fatal

## Notes
- The project is structured according to submission requirements
- All console.log statements are replaced with API-based logging
- The application uses proper error handling and user feedback mechanisms 
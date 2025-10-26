# Ticket Management System - React

A modern, fully-featured ticket management application built with React, featuring authentication, dashboard analytics, and complete CRUD operations.

## Technologies Used

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and development server
- **LocalStorage API** - Data persistence and session management
- **CSS3** - Styling with custom properties and responsive design

## Features

### Core Functionality
- ✅ Landing page with wavy hero section and decorative elements
- ✅ User authentication (Login/Signup) with session management
- ✅ Protected routes - automatic redirect to login if not authenticated
- ✅ Dashboard with ticket statistics
- ✅ Full CRUD operations for tickets
- ✅ Form validation with inline error messages
- ✅ Toast notifications for user feedback
- ✅ Confirmation dialogs for destructive actions
- ✅ Responsive design (mobile, tablet, desktop)

### Design System
- Max-width: 1440px centered layout
- Wavy SVG background in hero section
- Decorative floating circles
- Card-based layouts with shadows
- Status-based color coding:
  - **Open** → Green (#10B981)
  - **In Progress** → Amber (#F59E0B)
  - **Closed** → Gray (#6B7280)

### Validation Rules
- **Title**: Required field
- **Status**: Required, must be one of: `open`, `in_progress`, `closed`
- **Description**: Optional
- **Priority**: Optional (low, medium, high)
- Email format validation on auth forms
- Password minimum length validation

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the react-app directory:
```bash
cd react-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Demo Credentials

Use these credentials to test the application:

- **Email**: demo@example.com
- **Password**: password123

Alternatively, create a new account using the signup page.

## Application Structure

```
react-app/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Footer.jsx
│   │   ├── Footer.css
│   │   ├── Toast.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/           # Page components
│   │   ├── Landing.jsx   # Landing page with hero
│   │   ├── Landing.css
│   │   ├── Login.jsx     # Login form
│   │   ├── Signup.jsx    # Signup form
│   │   ├── Auth.css      # Shared auth styles
│   │   ├── Dashboard.jsx # Dashboard with stats
│   │   ├── Dashboard.css
│   │   ├── Tickets.jsx   # Ticket CRUD interface
│   │   └── Tickets.css
│   ├── utils/           # Utility functions
│   │   ├── auth.js      # Authentication logic
│   │   └── tickets.js   # Ticket management logic
│   ├── styles/          # Global styles
│   │   └── global.css   # Design system & base styles
│   ├── App.jsx          # Root component with routing
│   └── main.jsx         # Application entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## State Management

This application uses React hooks for state management:
- `useState` - Component-level state
- `useEffect` - Side effects and data loading
- `useNavigate` - Programmatic navigation
- LocalStorage - Persistent data storage

## Accessibility Features

- Semantic HTML elements (`<nav>`, `<main>`, `<footer>`)
- ARIA labels on form inputs
- Keyboard navigation support
- Focus states on interactive elements
- Sufficient color contrast ratios
- Descriptive error messages

## Session Management

Sessions are managed using LocalStorage with the key `ticketapp_session`. The session token is created upon successful login/signup and verified on protected routes.

To manually clear session:
```javascript
localStorage.removeItem('ticketapp_session');
```

## Data Storage

Ticket data is stored in LocalStorage under the key `ticketapp_tickets`. Sample tickets are automatically created on first load.

## Known Issues & Limitations

- Data is stored locally - not shared across devices
- No backend API integration
- Session tokens are simple base64 encoded strings (for demo purposes)
- No password encryption (mock authentication only)
- Browser LocalStorage limits apply (~5-10MB)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- Backend API integration
- Real authentication with JWT
- File attachments for tickets
- Ticket comments and history
- User roles and permissions
- Email notifications
- Search and filtering
- Sorting options
- Export functionality

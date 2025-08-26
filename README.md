# StoreSpace - Storage Unit Management System

A beautiful, modern, and futuristic storage unit rental management system built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

### Core Functionality
- **Dashboard Overview**: Real-time metrics, revenue charts, occupancy visualization, and activity tracking
- **Storage Units Management**: Visual grid/list views with color-coded availability status
- **Payment Tracking**: Comprehensive payment management with status indicators and overdue alerts
- **Calendar System**: Track contract expirations, payment due dates, and maintenance schedules
- **Smart Notifications**: Expiration alerts and payment reminders

### Design Features
- **Glass Morphism Effects**: Modern translucent UI elements with backdrop blur
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Design**: Optimized for desktop administration
- **Professional Color Scheme**: Carefully selected palette with gradient accents
- **Visual Status Indicators**: Color-coded badges and status markers

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **date-fns** - Date utilities

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd storage-manager
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
http://localhost:5173
```

## Project Structure

```
storage-manager/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Sidebar.jsx       # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Units.jsx         # Storage units management
│   │   │   ├── Payments.jsx      # Payment tracking
│   │   │   └── Calendar.jsx      # Event calendar
│   │   └── ui/
│   │       ├── Button.jsx        # Reusable button component
│   │       ├── Card.jsx          # Card components
│   │       └── Badge.jsx         # Status badges
│   ├── lib/
│   │   └── utils.js             # Utility functions
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles and Tailwind directives
├── index.html
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
└── package.json

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Color Scheme

The application uses a sophisticated color palette:

- **Primary**: Blue (#0ea5e9) - Main brand color
- **Accent**: Purple (#d946ef) - Highlight and emphasis
- **Success**: Green (#10b981) - Positive states
- **Warning**: Amber (#f59e0b) - Attention required
- **Danger**: Red (#ef4444) - Critical alerts
- **Info**: Blue (#3b82f6) - Informational states

## Status Indicators

### Unit Status
- **Available** (Green gradient): Ready for rental
- **Occupied** (Blue gradient): Currently rented
- **Maintenance** (Yellow gradient): Under maintenance
- **Overdue** (Red gradient): Payment overdue

### Payment Status
- **Paid** (Green): Payment completed
- **Pending** (Yellow): Awaiting payment
- **Overdue** (Red): Past due date
- **Failed** (Red): Payment failed

## Features Roadmap

- [ ] Customer management module
- [ ] Contract generation and management
- [ ] Document storage and viewer
- [ ] Advanced reporting and analytics
- [ ] Email/SMS notifications
- [ ] Mobile responsive design
- [ ] Dark mode support
- [ ] Multi-language support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software for StoreSpace management.

## Support

For support and questions, contact: admin@storespace.com

# QueueMe Frontend

A modern, responsive frontend for the QueueMe barbershop queue management system built with Next.js, Tailwind CSS, and ShadCN UI components.

## Features

### Public Pages
- **Home** (`/`) - Queue joining form with service selection
- **Queue Status** (`/queue-status`) - Check customer queue position
- **Services** (`/services`) - View available barbershop services
- **Trending** (`/trending`) - Browse trending haircut styles

### Admin Pages
- **Login** (`/admin/login`) - Admin authentication
- **Dashboard** (`/admin/dashboard`) - Statistics and overview
- **Queue Management** (`/admin/queue`) - Manage customer queue
- **Records** (`/admin/records`) - View historical data with filters
- **Haircut Styles** (`/admin/haircut-styles`) - CRUD for trending styles
- **Settings** (`/admin/settings`) - Configure daily limits and system settings

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Reusable component library
- **Lucide React** - Icon library
- **ClassNames** - Conditional CSS class utility

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend URL:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages
│   ├── globals.css        # Global styles
│   └── layout.jsx         # Root layout
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # ShadCN UI components
├── lib/                  # Utility functions
│   ├── api.js           # API client
│   └── utils.js         # Helper utilities
└── public/              # Static assets
```

## API Integration

The frontend integrates with the backend API through the `lib/api.js` client:

- **User endpoints** - Join queue, check status, cancel queue
- **Services endpoints** - Get available services
- **Auth endpoints** - Admin login
- **Admin endpoints** - Queue management, records, styles, settings

## Responsive Design

The application is built mobile-first with responsive design:

- **Mobile** - Single column layout, touch-friendly buttons
- **Tablet** - Two-column grid layouts
- **Desktop** - Multi-column layouts with sidebar navigation

## Component Library

Built with ShadCN UI components for consistency:

- **Card** - Content containers
- **Button** - Interactive elements
- **Input/Select** - Form controls
- **Table** - Data display
- **Dialog** - Modal dialogs
- **Label** - Form labels

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration for code quality
- Prettier for code formatting
- TypeScript-style JSDoc comments
- Consistent component structure

## Deployment

The application can be deployed to any platform that supports Next.js:

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

Or deploy to platforms like Vercel, Netlify, or AWS.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:5000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `QueueMe` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |

## Contributing

1. Follow the existing code style
2. Use TypeScript-style JSDoc for functions
3. Test components thoroughly
4. Ensure mobile responsiveness
5. Update documentation as needed

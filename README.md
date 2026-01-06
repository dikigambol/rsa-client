# RSA Client

A React-based client application for managing organizational permissions and divisions.

## Features

- User authentication with JWT
- Permission management (izin)
- Division management (divisi)
- User listing and management
- Structural organization view

## Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Authentication**: JWT Decode
- **Styling**: Bootstrap with custom CSS

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dikigambol/rsa-client.git
   cd rsa-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── assets/          # Static assets
├── pages/           # React components for different pages
│   ├── divisi.jsx
│   ├── fakeToken.jsx
│   ├── injeksiSql.jsx
│   ├── izin.jsx
│   ├── izinAtasan.jsx
│   ├── listUser.jsx
│   ├── login.jsx
│   └── struktural.jsx
├── services/        # API services
│   └── getUserInfo.js
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

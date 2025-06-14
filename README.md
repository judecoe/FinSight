# FinSight

A modern personal finance dashboard application built with React and Tailwind CSS.

## Overview

FinSight helps users visualize their financial data through an elegant, intuitive dashboard interface. Connect your bank accounts via Plaid to automatically track spending, monitor balances, and gain insights into your financial health.

## Features

- **Bank Integration**: Connect securely to your financial institutions via Plaid
- **Dashboard View**: See your financial data at a glance
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Easy on the eyes with a sleek dark theme
- **User Authentication**: Secure login to protect your financial data

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form for form validation
- **Authentication**: JWT-based auth with secure storage
- **API Integration**: Plaid API for bank connections

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/finsight.git
cd finsight
```

2. Install dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

3. Set up environment variables

```bash
# Create .env file in backend directory
cp backend/.env.example backend/.env
```

4. Start the development servers

```bash
# Start backend (from root directory)
cd backend
python -m uvicorn app.main:app --reload

# Start frontend (in a new terminal, from root directory)
cd frontend
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Project Structure

```
finance-dashboard/
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React context providers
│   │   └── ...
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── db/           # Database models
│   │   └── ...
├── README.md
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [FastAPI](https://fastapi.tiangolo.com/)

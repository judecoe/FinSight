# FinSight

A modern personal finance dashboard application built with Next.js and Tailwind CSS.

![alt text](https://github.com/judecoe/FinSight/blob/main/images/homepage.png "Logo Title Text 1")

#

## Overview

FinSight helps users visualize their financial data through an elegant, intuitive dashboard interface. Connect your bank accounts via Plaid to automatically track spending, monitor balances, and gain insights into your financial health.

## Features

- **Bank Integration**: Connect securely to your financial institutions via Plaid
- **Dashboard View**: See your financial data at a glance
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Easy on the eyes with a sleek dark theme
- **User Authentication**: Secure login to protect your financial data

## Tech Stack

- **Frontend**: Next.js (React framework), Tailwind CSS
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form for form validation
- **Authentication**: JWT-based auth with secure storage
- **API Integration**: Plaid API for bank connections

## Live Demo

🚀 **[View Live Application](https://finsight-b2j1o70uu-kxfhz8yjmj6mprqis-projects.vercel.app)**

The application is hosted on Vercel and available 24/7.

## Project Structure

```
finance-dashboard/
├── frontend/             # Next.js frontend
│   ├── pages/            # Next.js pages (file-based routing)
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

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Vercel](https://vercel.com/) for hosting

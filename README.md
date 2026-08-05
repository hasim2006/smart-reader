# Track Report Enterprise - RAG Application

An enterprise-grade Retrieval-Augmented Generation (RAG) platform and landing interface built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Features

- **Interactive RAG Search & Citations**: Real-time contextual document querying with detailed source citation drawer.
- **Modern Dashboard & Views**: Sleek interfaces for searching, viewing documents, and reviewing analytics.
- **Multi-Channel OTP Verification**: Integrations for WhatsApp Cloud API (Meta), Twilio, and SMTP Email gateways via Nodemailer.
- **Rich Analytics & Visualizations**: Data charts powered by Recharts.
- **Modern UI/UX**: Dynamic animations with Framer Motion, accessible icons via Lucide React, and styled with Tailwind CSS.

---

## 📁 Project Structure

```text
├── public/                 # Static public assets
├── src/
│   ├── app/                # Next.js 14 App Router routes & layouts
│   ├── components/         # Reusable React UI components
│   │   ├── landing/        # Hero section, feature showcases, customer logos, live demo
│   │   ├── layout/         # Header, footer, and main app layout components
│   │   └── views/          # Specific application views & drawers (e.g., CitationDrawer)
│   ├── context/            # Global React state context providers
│   ├── lib/                # API helpers, utilities, and integrations
│   └── types/              # TypeScript interfaces and type definitions
├── .env.example            # Environment variable template
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. Clone or extract the repository into your preferred folder.
2. Install project dependencies:

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env.local` and set up your credential keys:

```bash
cp .env.example .env.local
```

Configure your credentials for:
- WhatsApp Cloud API (Meta)
- Twilio WhatsApp API (Fallback)
- SMTP Email Gateway (Nodemailer)

### Development

Run the local development server:

```bash
npm run dev
```

Open [https://rag-application-puce.vercel.app](https://rag-application-puce.vercel.app) in your browser to view the application.

### Production Build

Build the optimized application for production:

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library**: [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Email**: [Nodemailer](https://nodemailer.com/)

---

## 📄 License

Private / Enterprise Proprietary.
#

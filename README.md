# NL-Portfolio

Personal portfolio built with Astro, React, and Tailwind, featuring a dark minimal aesthetic with color accents on hover.

## Stack

- Astro
- React
- Tailwind CSS
- Three.js
- GSAP

## Requirements

- Node.js 20+
- npm

## Installation

```bash
git clone https://github.com/nicolasloto/NL-Portfolio.git
cd NL-Portfolio
npm install
```

## Development

```bash
npm run dev
```

Local app runs at `http://localhost:4321`.

## Build

```bash
npm run build
npm run preview
```

## Contact Form (`/api/contact`)

The form sends emails with Gmail OAuth2 using a Vercel Function at `api/contact.ts`.

### Environment Variables

Create a `.env` file:

```env
SMTP_USER=your@gmail.com
GMAIL_CLIENT_ID=your_google_client_id
GMAIL_CLIENT_SECRET=your_google_client_secret
GMAIL_REFRESH_TOKEN=your_google_refresh_token
CONTACT_FROM=Portfolio <your@gmail.com>
CONTACT_TO=lotohectornicolas@gmail.com
```

Notes:
- `CONTACT_TO` is optional and defaults to `lotohectornicolas@gmail.com`.
- You must set your OAuth app in Google Cloud to Testing and add your Gmail as a test user.

### Test Contact Locally

Since `/api/contact` is a Vercel Function, it is not available with `astro dev`.

Use:

```bash
vercel dev
```

Then open the URL shown by Vercel (usually `http://localhost:3000`) and submit the form.

## Deploy

Recommended: Vercel.

1. Import the repository into Vercel.
2. Configure Gmail OAuth2 environment variables.
3. Deploy.

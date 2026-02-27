# NL-Portfolio

Personal portfolio built with Astro, React, and Tailwind, featuring a dark minimal aesthetic with color accents on hover.

## GitHub Description

`Personal portfolio by Nicolas Loto: default dark mode, pixel/minimal aesthetic, subtle motion, and a custom contact endpoint (/api/contact).`

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

The form sends emails to `lotohectornicolas@gmail.com` using Resend through a Vercel Function at `api/contact.ts`.

### Environment Variables

Create a `.env` file:

```env
RESEND_API_KEY=your_api_key
CONTACT_FROM=Portfolio <onboarding@resend.dev>
```

For production, replace `onboarding@resend.dev` with a sender from your verified Resend domain.

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
2. Configure `RESEND_API_KEY` and `CONTACT_FROM`.
3. Deploy.
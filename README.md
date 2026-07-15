# Next.js Client Frontend Documentation

This directory contains the user interface of the Social Feed / Blog application, built using Next.js 16 (App Router), React 19, TypeScript, and styled with Tailwind CSS v4.

---

## 🏗️ Folder Structure

The frontend code follows Next.js App Router conventions:

```
client/
├── app/
│   ├── components/       # Core UI and state management components
│   │   ├── AuthLayout.tsx    # Left side/Right side split screen template for authentication
│   │   ├── Avatar.tsx        # Fallback profile icon and status avatar
│   │   ├── InputField.tsx    # Styled and accessible text input wrapper
│   │   ├── Navbar.tsx        # Top navigation layout containing user profiles, theme toggles, and searching UI
│   │   ├── PostCard.tsx      # Main card rendering posts, edit forms, likes, sharing, and replies
│   │   ├── SidebarLeft.tsx   # Left sidebar for navigation and user profiles
│   │   ├── SidebarRight.tsx  # Right sidebar with sponsored section and suggested users
│   │   └── ThemeContext.tsx  # Global light/dark theme state provider
│   │
│   ├── login/            # Page controller for the Login screen (`/login`)
│   │   └── page.tsx
│   ├── registration/     # Page controller for the Sign-Up screen (`/registration`)
│   │   └── page.tsx
│   │
│   ├── globals.css       # Main stylesheet initializing Tailwind CSS v4 variables
│   ├── layout.tsx        # Root HTML wrapper importing Poppins web-fonts and ThemeProvider
│   ├── middleware.ts     # Client-side router authentication guard
│   └── page.tsx          # Main dashboard social feed screen (`/`)
│
├── lib/                  # Frontend utilities
│   ├── api.ts            # Axios interceptor config with support for Node SSR cookies and multipart uploads
│   └── time.ts           # Timestamps and post creation age formatter
│
├── .env.local            # Local dev environmental overrides
├── next.config.ts        # Next.js bundler settings
├── tsconfig.json         # TypeScript configurations
└── package.json          # Dependency packages and script mappings
```

---

## 🛠️ Setup & Installation

### Requirements
- **Node.js**: v18.0.0 or higher
- **npm** or **Yarn**

### Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment variables**:
   Create a `.env.local` file at the root of the `client/` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
   ```
   *Note: Make sure the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` matches the configuration on the backend.*

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🛡️ Authentication Router Guard

The application contains a Next.js `middleware.ts` file situated at the client root. It intercepts routing requests to verify authentication:
- Checks the `token` cookie directly.
- **Anonymous Users**: Attempting to load `/` or secure screens will be automatically redirected to `/login`.
- **Authenticated Users**: Attempting to load `/login` or `/registration` will be redirected back to the `/` feed page.
- Excludes static resources (`/_next`, `/images`, etc.) and internal APIs to avoid routing loop errors.

---

## 🛰️ Axios API Client (`lib/api.ts`)

The `useAxios()` utility creates a customized Axios instance for request sending:
- **Server-Side Rendered (SSR) support**: It detects whether it's executing in a browser environment or Node.js server context. If SSR, it imports cookies directly from `next/headers` to attach session authorizations.
- **Credentials Handling**: Configured with `withCredentials: true` to ensure JWT cookies are correctly received and sent.
- **Multipart support**: Integrates a request interceptor that removes default JSON Headers when a payload inherits a `FormData` block (crucial for files/image uploads).

---

## 🎨 Theme & Typography

- **Font Family**: Uses the Google **Poppins** typeface family (weights 100 to 800), loaded efficiently via Next.js `next/font/google` optimizations.
- **Dark/Light Mode**: Governed by the `ThemeContext.tsx` provider, which toggles the `dark` class on the root `<html>` element. Styles change automatically using Tailwind's native selector utilities (e.g. `dark:bg-slate-900`). The chosen theme is persisted locally in the browser storage (`localStorage`).
- **Styling Framework**: Designed with Tailwind CSS v4, which defines variables inside `app/globals.css`.

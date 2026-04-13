# 💬 Chatroom — Real-Time Private Messaging App

A full-stack real-time chat application built with **Next.js 16**, **Socket.IO**, **Drizzle ORM**, **PostgreSQL (Neon)**, and **Better Auth**.

---

## 📸 Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack)  |
| Language       | TypeScript                          |
| Real-time      | Socket.IO (custom HTTP server)      |
| Database       | PostgreSQL (Neon serverless)        |
| ORM            | Drizzle ORM                         |
| Authentication | Better Auth (GitHub + Google OAuth) |
| Styling        | Tailwind CSS v4                     |
| UI Components  | shadcn/ui                           |

---

## 🏗️ Project Structure

```
chatroom/
├── app/
│   ├── layout.tsx              # Root layout (fonts, providers)
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── chat/
│   │   └── page.tsx            # Main chat page (assembles all 3 sections)
│   ├── Sign-in/                # Sign-in page
│   ├── Sign-up/                # Sign-up page
│   └── api/
│       └── [...all]/           # Better Auth catch-all API route
│
├── components/
│   ├── LeftScetion.tsx         # Contact list sidebar + socket connection owner
│   ├── CentralSection.tsx      # Chat messages area + message sending
│   ├── RightSection.tsx        # User profile panel
│   ├── SignInCard.tsx           # Animated sign-in form
│   ├── SignUpCard.tsx           # Animated sign-up form
│   └── ui/                     # shadcn/ui components
│
├── db/
│   ├── index.ts                # Database connection (pg Pool + Drizzle)
│   └── schema/
│       ├── index.ts            # Re-exports all schemas
│       ├── auth-schema.ts      # User, Session, Account, Verification tables
│       └── schema.ts           # Messages table
│
├── lib/
│   ├── auth.ts                 # Better Auth server config (GitHub + Google)
│   ├── auth-client.ts          # Better Auth client (signIn, signUp, useSession)
│   ├── scoket.ts               # Socket.IO client instance (singleton)
│   └── utils.ts                # CN utility for classnames
│
├── hooks/
│   └── use-mobile.ts           # Mobile detection hook
│
├── server-action/
│   └── leftSidebar.ts          # Server actions (fetch users, messages, send, markSeen)
│
├── server.ts                   # Custom HTTP server (Next.js + Socket.IO)
├── drizzle.config.ts           # Drizzle Kit migration config
├── package.json
└── tsconfig.json
```

---

## 🚀 How to Set Up (From Scratch)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd chatroom
npm install
```

### 2. Set Up PostgreSQL Database

This project uses **Neon** (serverless PostgreSQL). Create a free database at [neon.tech](https://neon.tech).

### 3. Configure Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=<random-32-char-string>
BETTER_AUTH_URL=http://localhost:3000

# GitHub OAuth (https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### How to get OAuth credentials:

**GitHub:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Set Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

### 4. Push Database Schema

```bash
npx drizzle-kit push
```

This creates the tables: `user`, `session`, `account`, `verification`, and `messages`.

### 5. Run the Dev Server

```bash
npm run dev
```

This runs `tsx server.ts` which starts a **custom HTTP server** on port `3000` that serves both:
- The Next.js app (pages, API routes)
- The Socket.IO WebSocket server (real-time messaging)

> ⚠️ **Important:** Do NOT use `next dev` directly. Always use `npm run dev` because the custom `server.ts` is required for Socket.IO to work.

### 6. Open the App

Go to `http://localhost:3000`, sign up with GitHub/Google, and start chatting!

---

## ⚙️ How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Custom HTTP Server (server.ts)            │
│                                                             │
│  ┌──────────────────────┐    ┌────────────────────────────┐ │
│  │   Next.js App        │    │   Socket.IO Server         │ │
│  │   (Pages + API)      │    │   (WebSocket connections)  │ │
│  │                      │    │                            │ │
│  │  /chat               │    │  Events:                   │ │
│  │  /Sign-in            │    │  - register_user           │ │
│  │  /Sign-up            │    │  - send_private_message    │ │
│  │  /api/auth/[...all]  │    │  - receive_private_message │ │
│  └──────────────────────┘    └────────────────────────────┘ │
│                                                             │
│                    Port 3000                                │
└─────────────────────────────────────────────────────────────┘
```

### Custom Server (`server.ts`)

The key to real-time messaging. Instead of using the default `next dev`, we create a **custom Node.js HTTP server** that:

1. Attaches **Next.js** request handler for all page/API routes
2. Attaches **Socket.IO** for WebSocket connections
3. Maintains an in-memory map of `userId → socketId` for routing messages

```
User A connects → registers as userId "abc" → server stores { "abc": "socket123" }
User A sends message to User B → server looks up User B's socketId → emits directly to them
```

### Socket.IO Client (`lib/scoket.ts`)

A **singleton** Socket.IO client instance shared across all components:

```typescript
export const socket = io("http://localhost:3000", {
  autoConnect: false,  // We manually connect after getting user session
});
```

> `autoConnect: false` is critical — we only connect after the user is authenticated.

### Socket Lifecycle (Who Owns the Connection)

**`LeftSection` owns the socket connection.** It is always mounted when on the chat page, so it:

1. Connects the socket on mount
2. Waits for the `"connect"` event before emitting `"register_user"`
3. Disconnects on unmount (page leave)

**`CentralSection` only listens.** It does NOT connect/disconnect — it just:

1. Listens for `"receive_private_message"` events
2. Emits `"send_private_message"` when the user sends a message

> ⚠️ **Critical Rule:** Never call `socket.connect()` or `socket.disconnect()` from multiple components. Only ONE component should own the connection lifecycle. Multiple components calling disconnect on a shared singleton will kill the connection for everyone.

### Message Flow

```
Sending a message:
1. User types message → clicks Send
2. CentralSection adds message to UI immediately (optimistic update)
3. CentralSection calls sendMessage() server action → saves to PostgreSQL
4. CentralSection emits "send_private_message" via socket
5. Server receives event → looks up receiver's socketId → emits "receive_private_message"
6. Receiver's CentralSection hears event → adds message to their UI
7. Receiver's LeftSection hears event → increments unread badge count
```

```
Receiving a message:
1. Socket.IO server emits "receive_private_message" to receiver
2. LeftSection handler: increments unseenMessageCount for the sender (unless currently viewing their chat)
3. CentralSection handler: adds message to the messages array (only if it's relevant to the current conversation)
```

### Authentication (Better Auth)

- **Server config** (`lib/auth.ts`): Sets up Better Auth with Drizzle adapter, GitHub and Google OAuth
- **Client** (`lib/auth-client.ts`): Exports `signIn`, `signUp`, `useSession`, and `authClient.getSession()`
- **API route** (`app/api/[...all]/route.ts`): Catch-all route that handles all auth endpoints
- **Flow**: User signs in via GitHub/Google → Better Auth creates user in DB → session cookie set → `authClient.getSession()` returns user data

### Database Schema

**User** (managed by Better Auth):
| Column         | Type      | Description           |
| -------------- | --------- | --------------------- |
| id             | text (PK) | Unique user ID        |
| name           | text      | Display name          |
| email          | text      | Email (unique)        |
| emailVerified  | boolean   | Email verified status |
| image          | text      | Profile picture URL   |
| createdAt      | timestamp | Account creation time |
| updatedAt      | timestamp | Last update time      |

**Messages**:
| Column     | Type      | Description                    |
| ---------- | --------- | ------------------------------ |
| id         | uuid (PK) | Auto-generated message ID      |
| senderId   | text (FK) | References user.id             |
| receiverId | text (FK) | References user.id             |
| content    | text      | Message text                   |
| seen       | boolean   | Read receipt (default: false)  |
| createdAt  | timestamp | When message was sent          |
| updatedAt  | timestamp | Last update time               |

### Server Actions (`server-action/leftSidebar.ts`)

| Function                    | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `getAllUserForLeftSideBar()` | Fetches all users except current + unseen counts |
| `getUser()`                 | Fetches a single user by ID                      |
| `getChatMessages()`         | Fetches all messages between two users           |
| `markSeen()`                | Marks messages from a user as seen               |
| `sendMessage()`             | Inserts a new message into the database          |

### Chat Page Layout (`app/chat/page.tsx`)

The chat page is a 3-panel layout:

```
┌──────────────┬─────────────────────────┬──────────────┐
│              │                         │              │
│  LeftSection │    CentralSection       │ RightSection │
│  (contacts)  │    (messages)           │ (profile)    │
│              │                         │              │
│  - User list │    - Message history    │ - Avatar     │
│  - Unread    │    - Input box          │ - Name       │
│    badges    │    - Send button        │ - Email      │
│  - Search    │                         │ - Info       │
│              │                         │              │
└──────────────┴─────────────────────────┴──────────────┘
```

- `selectedUser` state is lifted to the chat page and passed to all sections
- `LeftSection` updates `selectedUser` when a contact is clicked
- `CentralSection` shows messages for the `selectedUser`
- `RightSection` shows profile info for the `selectedUser`

---

## 📝 Common Commands

```bash
# Run dev server (Next.js + Socket.IO)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Push schema changes to database
npx drizzle-kit push

# Generate migrations
npx drizzle-kit generate

# Open Drizzle Studio (database GUI)
npx drizzle-kit studio
```

---

## 🐛 Common Issues & Fixes

### "Another next dev server is already running"
```bash
# Find and kill the process
taskkill /PID <pid> /F

# Or kill everything on port 3000
netstat -ano | findstr :3000
taskkill /PID <found_pid> /F
```

### Users not showing in LeftSection
- Check that you're logged in (session must exist)
- Check that other users have signed up (you need at least 2 accounts)
- Check the server terminal for `[DEBUG]` or `[ERROR]` logs
- Verify `DATABASE_URL` in `.env` is correct

### Socket not connecting
- Make sure you're using `npm run dev` (not `next dev`)
- Check server terminal for "Connected:" logs
- The socket only connects after `authClient.getSession()` returns a valid user

### Hydration mismatch warnings
- These are harmless in development — caused by dynamic class generation with `cn()` utility
- They don't appear in production builds

---

## 🔑 Key Design Decisions

1. **Custom HTTP server** instead of Next.js API routes for WebSocket — Next.js doesn't natively support WebSocket in API routes, so `server.ts` creates a shared HTTP server for both Next.js and Socket.IO.

2. **Singleton socket client** (`lib/scoket.ts`) — One shared instance across all components to avoid multiple connections per user.

3. **Socket lifecycle owned by LeftSection** — Since LeftSection is always mounted on the chat page, it's the single owner of `socket.connect()` / `socket.disconnect()`. Other components only listen/emit.

4. **Optimistic UI updates** — Messages appear instantly in the sender's UI before database confirmation, making the chat feel fast.

5. **`autoConnect: false`** — Socket only connects after authentication, preventing anonymous connections.

6. **Server actions** for database operations — Uses Next.js server actions instead of API routes for cleaner data fetching.

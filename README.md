# Sky Spy Bot - Telegram Weather Bot

## Introduction
Sky Spy Bot is a Telegram bot that provides real-time weather updates based on user subscriptions. Users can:
- Subscribe to daily weather updates.
- Retrieve weather details for any city.
- Manage their subscriptions via an admin panel.

This bot is built using **Next.js** for the frontend, **NestJS** for the backend, **MongoDB** as the database, and **Telegraf** for Telegram bot interactions.

### Links
```plaintext
Live Demo: https://sky-spy-bot-git-main-pratham-rastogis-projects.vercel.app/
(Note: The deployed link may take time to load due to free-tier server limitations.)
GitHub Repository: https://github.com/Prathamrastogi/SkySpy_bot
Telegram Bot: https://t.me/skyspyupdate_bot
```

## Features
```plaintext
- Start Command (/start): Registers the user in the database.
- Subscribe Command (/subscribe): Allows users to subscribe to daily weather updates.
- Weather Command (/weather): Fetches weather details for a specific city.
- Admin Panel: Manages users, API keys, and bot settings.
- Dynamic Weather API Key Management: The bot fetches the API key from the database instead of using environment variables.
- Webhook Deployment: Uses Vercel with Telegram webhook integration.
```

## Tech Stack
```plaintext
- Frontend: Next.js
- Backend: Nest.js (API Routes for backend)
- Database: MongoDB (via Mongoose)
- Authentication: Google OAuth
- Telegram Integration: Telegraf
- Weather API: OpenWeatherMap (free tier)
- Deployment: Vercel (for frontend), Render (for backend), MongoDB Atlas
```

## Setup & Installation

### 1️⃣ Prerequisites
```plaintext
Ensure you have the following installed:
- Node.js (>=16.x)
- MongoDB Atlas (or a local MongoDB instance)
- Telegram Bot Token (from @BotFather)
- OpenWeatherMap API Key
```

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/Prathamrastogi/SkySpy_bot.git
cd SkySpy_bot
```

### 3️⃣ Install Dependencies
```bash
# Install frontend dependencies
npm install

# Navigate to backend directory
cd backend
# Install backend dependencies
npm install
```

### 4️⃣ Setup Environment Variables
#### For **Frontend** (`.env.local`)
```plaintext
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

#### For **Backend** (`.env`)
```plaintext
MONGODB_URI=
BOT_TOKEN=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
BACKEND_URL=http://localhost:5000
```

### 5️⃣ Avoid Multiple Instances
```plaintext
Since the bot cannot handle multiple instances running simultaneously (e.g., using both the production link and local setup), it is recommended to test one instance at a time to avoid conflicts.
```

### 6️⃣ Start the Development Server
```bash
# Start frontend (http://localhost:3000)
npm run dev

# Start backend (http://localhost:5000)
cd backend
npm run start
```

### 7️⃣ Ready to Use 🎉

## Usage
```plaintext
Once the bot is set up, you can start using the following commands on Telegram:
- Start the bot: /start
- Subscribe for updates: /subscribe
- Unsubscribe from updates: /unsubscribe
- Get weather details: /weather
```

## Conclusion
```plaintext
The Sky Spy Bot assignment provided by AST Consulting was an exciting and challenging task that allowed me to showcase my full-stack development skills. Throughout the project, I tackled various technical challenges, including:
- Setting up dynamic API key management.
- Handling Telegram webhook integration efficiently.

While the backend logic is well-structured and fully functional, the admin panel UI could benefit from design improvements. However, I have ensured that the code is well-documented to enhance readability and maintainability.
```

### Additional Resources 📽️
```plaintext
To further demonstrate the functionality, I have prepared a video walkthrough:
1️⃣ Functionality Walkthrough – [Link Here]
```

```plaintext
I hope these resources help in testing and evaluating my submission smoothly. I am excited about the next steps in the selection process and look forward to further discussions with AST Consulting.

Thank you for the opportunity! 🙌
Made for AST Consulting
👨‍💻 Pratham Rastogi
```


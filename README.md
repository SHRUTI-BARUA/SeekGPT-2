# SeekGPT 🔍💬

SeekGPT is a full-stack, responsive AI-powered chat application built with the **MERN (MongoDB, Express, React, Node.js)** stack and integrated with the state-of-the-art **Google Gemini 2.5 Flash** large language model. It offers a premium, modern chat interface similar to ChatGPT, complete with a clean user experience, dynamic markdown rendering, syntax highlighting for code blocks, a smooth character typing effect, and full chat thread management (CRUD operations).

---

## 🚀 Key Features (Implemented & Live)

- **🤖 Google Gemini AI Integration**: Integrates directly with the `gemini-2.5-flash` model using optimized, secure HTTP REST calls on the backend, enabling fast and precise AI responses.
- **📁 Multi-Thread Chat History (Full CRUD)**:
  - **Create**: Automatically generates a new chat thread upon user inquiry.
  - **Read**: Fetches previous chat sessions dynamically from MongoDB (`GET /api/thread` sorted by updatedAt).
  - **Update**: Append user prompts and AI responses to existing threads in real-time.
  - **Delete**: Remove historical chat threads instantly from the database and UI, auto-creating a fresh session if the active thread is deleted.
- **✨ Premium UI/UX & Micro-Animations**:
  - Styled completely using customizable **Vanilla CSS** for highly controlled layouts.
  - Interactive sidebar for thread navigation with active highlights and dynamic hover actions.
  - Interactive user avatar dropdown with options for plan upgrade, settings, and logging out.
- **⏳ Advanced AI Typing & Loading States**:
  - Character/Word streaming animation (typing simulation effect) using React `setInterval` timers for a humanized feel.
  - High-performance, visual loading indicators utilizing **react-spinners** (`ScaleLoader`) to represent pending network requests.
- **📝 Code Syntax & Markdown Rendering**:
  - Live markdown formatting of complex AI responses with **react-markdown**.
  - Advanced syntax highlighting in code segments using **rehype-highlight** and **highlight.js** (configured with a elegant dark-mode theme).
- **📂 Clean Global State Management**:
  - Built-in global state architecture powered by the **React Context API** (`createContext`/`useContext`) to ensure seamless data flow across the sidebar, chat container, and inputs without prop drilling.

---

## 🛠️ Tech Stack & Architecture

### **Frontend (Client)**
- **Framework**: React 19 (Vite-powered, offering lightning-fast Hot Module Replacement)
- **State Management**: React Context API
- **Styling**: Vanilla CSS, FontAwesome 6 (Icons)
- **Libraries**:
  - `react-markdown` (Rich text/Markdown processing)
  - `rehype-highlight` & `highlight.js` (Syntax parsing for code blocks)
  - `react-spinners` (Sleek loading loaders)
  - `uuid` (Client-side unique transaction/thread ID generation)

### **Backend (Server)**
- **Runtime Environment**: Node.js
- **Web Framework**: Express (v5)
- **Database**: MongoDB (via Mongoose v9 Object Data Modeling)
- **Security & Utilities**: CORS (Cross-Origin Resource Sharing), Dotenv (Secure credential isolation)
- **Model Integration**: Direct HTTPS requests to Google's Generative Language REST Endpoint (`gemini-2.5-flash`)

---

## 📦 Project Structure

```text
SeekGPT/
├── Backend/
│   ├── models/
│   │   └── Thread.js      # Mongoose Schema (threadId, title, messages array)
│   ├── routes/
│   │   └── chat.js        # Express API endpoints (/thread, /thread/:id, /chat)
│   ├── utils/
│   │   └── openai.js      # Gemini API Fetch wrapper
│   ├── .env               # Environment configuration (MONGODB_URI, GEMINI_API_KEY)
│   ├── server.js          # Express app initialization & DB connection
│   └── package.json       # Backend dependencies
├── Frontend/
│   ├── src/
│   │   ├── assets/        # Local icons and assets
│   │   ├── App.jsx        # App component and Context Provider
│   │   ├── Chat.jsx       # Chat list component (Markdown rendering + typing effect)
│   │   ├── ChatWindow.jsx # Input console, navbar, profile dropdown & spinner
│   │   ├── Sidebar.jsx    # Historical thread manager (Select, Create, Delete actions)
│   │   ├── Mycontext.jsx  # Global React Context definition
│   │   ├── main.jsx       # Vite mount entry point
│   │   └── *.css          # Individual styling stylesheets (Vanilla CSS)
│   ├── index.html         # Main HTML document template
│   └── package.json       # Frontend dependencies
└── package.json           # Root package configurations
```

---

## 🛠️ Getting Started

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### **Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:8080`)*

### **Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:5173` or similar Vite port)*

---

## 🎯 Future Roadmap
- [ ] User authentication and access control (JWT/OAuth).
- [ ] Real-time streaming response parsing directly from Gemini stream endpoints.
- [ ] Direct code-copy button and chat export options.
- [ ] Persistent dark/light theme options.

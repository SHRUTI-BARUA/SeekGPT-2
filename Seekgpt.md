# SeekGPT Frontend Project Documentation

> [!NOTE]
> This document provides an in-depth, industrial-level architectural and technical report of the **SeekGPT Frontend** project. It details the implemented features, technology stack, state management, component architecture, and backend integration points based on the factual implementation of the codebase.

## 1. Executive Summary
SeekGPT is a web-based conversational AI interface built with React. It provides a user experience similar to modern LLM chat applications (e.g., ChatGPT). The application allows users to create conversation threads, view their chat history, send prompts, and receive AI-generated responses with real-time typing effects and markdown support.

## 2. Technology Stack
The project is built using modern frontend tooling and libraries:
* **Core Framework:** React 19 (using Function Components and Hooks)
* **Build Tool:** Vite (for fast HMR and optimized production builds)
* **State Management:** React Context API (`MyContext`)
* **Routing:** Single Page Application (SPA) without strict URL routing, relying on state-based conditional rendering.
* **Styling:** Vanilla CSS (`App.css`, `Chat.css`, `ChatWindow.css`, `Sidebar.css`)
* **Key Dependencies:**
  * `react-markdown` & `rehype-highlight`: For rendering markdown-formatted AI responses with code syntax highlighting (GitHub Dark theme).
  * `react-spinners`: For displaying loading states (`ScaleLoader`) during API calls.
  * `uuid`: For generating unique thread identifiers (`uuidv1`).

## 3. Architecture & State Management
The application relies on a centralized state management pattern using the React Context API (`MyContext.jsx`). The `App.jsx` component serves as the state provider.

### 3.1 Global State Variables
The following states are managed globally and consumed by child components:
* `prompt` (String): The current user input in the chat box.
* `reply` (String | null): The latest response received from the backend.
* `currentThreadId` (String): UUID of the active conversation thread.
* `prevChat` (Array): Array of message objects `{ role: 'user' | 'model', content: String }` representing the current conversation.
* `newChat` (Boolean): Flag indicating if the current view is a fresh, empty session.
* `allThreads` (Array): List of all historical chat threads fetched from the backend.

## 4. Component Analysis

### 4.1 App Component (`App.jsx`)
The root component wraps the application in the `MyContext.Provider`. It structures the layout into two main sections:
1. `<Sidebar />`
2. `<ChatWindow />`

### 4.2 Sidebar Component (`Sidebar.jsx`)
Responsible for thread management and navigation.
* **Thread Initialization:** Uses `uuidv1()` to generate a new thread ID when creating a new chat.
* **Data Fetching:** Automatically fetches all threads on mount and when `currentThreadId` changes.
* **Thread Switching:** Updates the global state with the selected thread's history and ID.
* **Thread Deletion:** Allows users to delete a thread. If the currently active thread is deleted, it gracefully falls back to a new chat session.

### 4.3 ChatWindow Component (`ChatWindow.jsx`)
The primary interaction layer.
* **UI Elements:** Top navbar with a user profile dropdown, a chat display area, a loading spinner (`ScaleLoader`), and an input field.
* **Input Handling:** Captures user input via an `onChange` handler and triggers the submission on `Enter` key press or submit button click.
* **API Integration:** Sends the user prompt and `currentThreadId` to the backend via a `POST` request.
* **State Updates:** Upon receiving a response, it appends the user prompt and model reply to the `prevChat` array and clears the input box.

### 4.4 Chat Component (`Chat.jsx`)
Responsible for rendering the conversation blocks.
* **Message Segregation:** Differentiates between user messages (plain text) and model messages (rendered via `ReactMarkdown`).
* **Typing Animation:** Implements a custom typing effect using `setInterval`. When a new `reply` is received, it splits the text by spaces and incrementally updates the displayed text (`latestReply`) every 40ms, simulating a human-like typing experience.
* **Syntax Highlighting:** Uses `rehype-highlight` plugin to format code snippets returned by the AI.

## 5. Backend API Integration
The frontend integrates with a remote backend hosted on AWS EC2 (`http://ec2-13-204-69-234.ap-south-1.compute.amazonaws.com:8080`). 

> [!WARNING]
> The backend URL is hardcoded into the components. In an industrial production environment, these should be moved to `.env` configuration files to separate environments (Dev, Staging, Prod).

### 5.1 Endpoints Utilized
1. **Send Message:**
   * **Endpoint:** `POST /api/chat`
   * **Payload:** `{ message: String, threadId: String }`
   * **Response:** `{ reply: String }`
2. **Fetch All Threads:**
   * **Endpoint:** `GET /api/thread`
   * **Response:** Array of thread objects `[{ threadId: String, title: String }, ...]`
3. **Fetch Thread Details:**
   * **Endpoint:** `GET /api/thread/:threadId`
   * **Response:** Array of chat history messages `[{ role: String, content: String }, ...]`
4. **Delete Thread:**
   * **Endpoint:** `DELETE /api/thread/:threadId`

## 6. Validated Results & Implementations
Based on the provided codebase, the following features are actively implemented and functional:
* **Session Management:** UUID-based sessions correctly partition chat histories.
* **Responsive State:** The UI reactively updates as threads are created, switched, or deleted.
* **Markdown Parsing:** AI responses containing markdown are correctly parsed into HTML elements (bold, lists, etc.), with embedded code blocks styled via `highlight.js`.
* **Typing Experience:** The 40ms word-by-word streaming effect successfully creates the illusion of real-time generation on the frontend side.

## 7. Recommendations for Future Improvements
To elevate the project further to enterprise-grade standards, the following improvements are recommended:
1. **Environment Variables:** Move the hardcoded AWS EC2 API URLs to Vite environment variables (`import.meta.env.VITE_API_URL`).
2. **Error Handling:** Implement robust error handling (e.g., toast notifications) when `fetch` requests fail. Currently, errors are only logged to the console.
3. **Streaming API (SSE/WebSockets):** Instead of simulating a typing effect on the frontend after receiving the full response, migrate the backend to stream tokens via Server-Sent Events (SSE) for true real-time feedback.
4. **Mobile Responsiveness:** Ensure the CSS handles mobile layouts seamlessly (e.g., collapsing the sidebar via a hamburger menu).

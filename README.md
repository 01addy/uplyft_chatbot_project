# 🛒 Uplyft E-Commerce Chatbot Assistant

A full-stack intelligent chatbot system built to enhance the product discovery and customer support experience for e-commerce platforms. This assistant helps users search, explore, and receive recommendations — all via a responsive, voice-enabled, conversational interface.

---

## 📌 Table of Contents
- [🎯 Project Objective](#-project-objective)
- [📐 Architecture Overview](#-architecture-overview)
- [🧰 Tech Stack](#-tech-stack)
- [🚀 Features Implemented](#-features-implemented)
- [💡 Bonus + Extra Features](#-bonus--extra-features)
- [⚙️ Project Setup & Execution](#️-project-setup--execution)
- [📦 Mock Data Generation](#-mock-data-generation)
- [📊 Sample Queries](#-sample-queries)
- [📖 Technical Documentation](#-technical-documentation)
- [🧠 Challenges Faced & Solutions](#-challenges-faced--solutions)
- [🧾 Deliverables](#-deliverables)

---

## 🎯 Project Objective

To develop a responsive and intelligent chatbot that:
- Enables users to **search, discover, and filter products**
- Maintains session continuity and stores chat history
- Offers personalized **product recommendations**
- Collects **feedback** from users post-session
- Works well on all device sizes (desktop, tablet, mobile)

---

## 📐 Architecture Overview

Frontend (React + Tailwind)
|
|---> Axios Requests
|
Backend (Flask + SQLAlchemy)
|
|---> SQLite DB (120 Mock Products)


- **Frontend:** React with Tailwind CSS & Toastify  
- **Backend:** Python Flask + RESTful APIs  
- **Database:** SQLite, populated using Faker  
- **Voice Input:** Web Speech API  
- **Deployment-Ready:** Railway-compatible backend  

---

## 🧰 Tech Stack

| Layer       | Technology                               |
|-------------|-------------------------------------------|
| Frontend    | React, React Router, Tailwind CSS         |
| Backend     | Flask, Flask-CORS, SQLAlchemy, JWT        |
| Database    | SQLite (mock e-commerce inventory)        |
| Tools       | Postman, Toastify, Day.js, Faker, Railway |
| Voice Input | Web Speech API (Chrome support)           |

---

## 🚀 Features Implemented

### ✅ Required Features
- 🔐 User Authentication (Register + Login using JWT)
- 💬 Chatbot interface with timestamped messages
- 📦 Product search via text input
- 📝 Chat history persistence
- 🔄 Conversation reset
- 🎯 Responsive design for all screen sizes

---

## 💡 Bonus + Extra Features

| Feature                      | Description                                       |
|-----------------------------|---------------------------------------------------|
| 🎙️ Voice Input              | Mic button captures user query (Web Speech API)  |
| 🧠 Product Recommendations   | Smart `/chat/recommendations` endpoint           |
| ⭐ Feedback System           | Prompt user for session rating and feedback      |
| 🧾 Chat Logging              | All messages saved via `/chat/log`               |
| 📌 Auto-scroll to bottom     | Ensures latest chat is always visible            |
| 📷 Dynamic product image     | Realistic images from `picsum.photos`            |
| 🎨 Tailwind UI Styling       | Modern responsive layout with dark/light contrast|

---

## ⚙️ Project Setup & Execution

### 📦 Backend Setup (Python + Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # For Windows
pip install -r requirements.txt
python seed_products.py        # Optional: Seed database with 120 products
python app.py                  # Run Flask server on localhost:5000

## 🌐 Frontend Setup (React + Tailwind)
cd frontend
npm install
npm start                      # Starts dev server on http://localhost:3000
```

## 📦 Mock Data Generation

- Generated using Faker in seed_products.py:
- 120 diverse products across Electronics, Books, and Textiles
- Rich descriptions, pricing, categories, image URLs
- Automatically clears and resets the product DB

## 📊 Sample Queries
- Query	Response
- show me laptops	Top 3 matching laptops
- recommend something	3 randomly selected products
- suggest me a good book	Book recommendations
- reset	Clears chat and triggers feedback prompt
- 🎙️ Voice: "t shirt under 500"	Auto-filled via mic, responds like text query

## 📖 Technical Documentation
### 🔧 Backend
- Framework: Flask with blueprints and modular routes
- Auth: JWT-based token management
- Models: User, Product, ChatLog, Feedback
- Routes: /auth, /products, /chat (history, log, feedback, recommendations)

### 💻 Frontend
- Routing: React Router for login/register/chat
- State: Context API for auth
- Voice Input: Web Speech API with toggle logic
- Styling: Tailwind with responsive utility classes

## 🧠 Challenges Faced & Solutions
- Challenge	Solution
- CORS issues during frontend/backend	Used flask-cors with allow-origin setup
- Tailwind not working with CRA	Downgraded to tailwindcss@3.3.5
- Speech API flaky behavior	Global toggle logic + fallback handling
- Stuck chat scroll	Added auto-scroll using useRef()
- Clean auth flow	Context API + token header injection in Axios

## 🧾 Deliverables
- ✅ Source Code Repository
- ✅ README.md with complete project setup + summary
- ✅ seed_products.py for database seeding
- ✅ Fully modular backend + frontend code
- ✅ All bonus features implemented
- ✅ Ready for GitHub Pages (frontend) or Railway (backend) deployment

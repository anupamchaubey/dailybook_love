# DailyBook — Frontend

Frontend client for **DailyBook**, a social blogging platform that supports user authentication, post visibility control, social following, and notifications.

This repository focuses on consuming backend APIs and providing a clean, functional user interface.  
The primary engineering emphasis of the project lies in the backend system.

---


## ✨ Features

- User authentication (JWT-based)
- Personalized feed for followed users
- Follow / unfollow users
- Notifications UI
- User profile management
- Tag-based filtering and search
- Cloud-hosted image support

---

## 🧩 Tech Stack

- React
- TypeScript
- Vite
- TanStack React Query
- Tailwind CSS / Shadcn UI
- Lucide Icons

---

## 🔗 Backend Integration

This frontend consumes REST APIs provided by the **DailyBook Backend**.

Backend repository:  
➡️ https://github.com/anupamchaubey/Daily-Book

Ensure the backend service is running before starting the frontend.

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🚀 Running Locally

```bash
npm install
npm run dev

```
The application will be available at:

http://localhost:5173

## 🎯 Project Focus

This frontend is intentionally lightweight and designed to:

- Integrate cleanly with backend APIs
- Demonstrate authentication and authorization flows
- Provide a usable interface for testing backend functionality

Complex business logic, security, and access control are handled entirely by the backend.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Anupam**  
B.Tech CSE  
Backend / SDE Aspirant

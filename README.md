#  Smart Cart Optimization Engine

AI-powered shopping cart application that provides **intelligent product recommendations** based on cart contents. Built using the **MERN Stack** with seamless frontend-backend integration and cloud deployment.

---

##  Live Demo

 **Frontend:**  
https://smart-cart-optimization-engine.vercel.app

 **Backend API:**  
https://smart-cart-backend-nji9.onrender.com

> **Note:** The backend is hosted on Render's free tier and may take **30–60 seconds** to respond on the first request if it has been inactive.

---

##  Tech Stack

| Frontend | Backend | Database | Deployment |
|----------|----------|----------|------------|
| React.js | Node.js | MongoDB | Vercel |
| Vite | Express.js | Mongoose | Render |
| React Router DOM | REST APIs | | Axios |

---

##  Features

-  Product Catalog
-  Shopping Cart Management
-  AI-Based Product Recommendations
-  Category-wise Product Filtering
-  Responsive UI
-  Fast API Integration
-  Cloud Deployment (Vercel + Render)

---

##  Project Structure

```
Smart-Cart-Optimization-Engine
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── Backend/
│   ├── seed/                     # Database seed scripts
│   │
│   ├── src/
│   │   ├── ai/                   # AI recommendation logic
│   │   ├── config/               # Database & app configuration
│   │   ├── controllers/          # Request handling
│   │   ├── data/                 # Static datasets
│   │   ├── engine/               # Recommendation engine
│   │   ├── middleware/           # JWT authentication middleware
│   │   ├── ml/                   # Machine Learning utilities
│   │   ├── models/               # Mongoose models
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   └── utils/                # Helper functions
│   │
│   ├── API_DOCUMENTATION.md
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

##  Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/MridulShahh/Smart-Cart-Optimization-Engine.git
cd Smart-Cart-Optimization-Engine
```

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
npm start
```

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

---

##  Deployment

- **Frontend:** Vercel
- **Backend:** Render

---

##  Future Enhancements

- Personalized AI Recommendations
- User Authentication
- Order Management
- Wishlist Feature
- Payment Gateway Integration
- Admin Dashboard

---

##  Author

**Mridul Shah**

GitHub: https://github.com/MridulShahh

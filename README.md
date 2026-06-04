# 🏠 InfyNest AI - AI-Powered Real Estate Platform

> India's most advanced AI-powered real estate platform with ML price predictions, investment scoring, and smart recommendations.

![InfyNest AI](https://img.shields.io/badge/InfyNest-AI%20Powered-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-Flask-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge)

---

## ✨ Features

### 🤖 AI-Powered
- **Price Prediction** - ML model predicts accurate property prices
- **Investment Score** - AI rates properties from 1-100
- **ROI Calculator** - Future value projection with growth rates
- **Rental Yield** - Calculate annual rental returns
- **Market Trends** - Rising areas and hot investment zones
- **Smart Recommendations** - Personalized property suggestions

### 🏘️ Property Management
- 11 property types (Apartment, Villa, Plot, Commercial, etc.)
- Dynamic forms based on property type
- Advanced search with 10+ filters
- Side-by-side property comparison
- Image upload and virtual tours

### 👥 Role-Based Dashboards
- **Buyer** - Save, compare, track visits, AI recommendations
- **Seller** - List properties, track views & inquiries
- **Agent** - Manage clients, schedule visits, track revenue
- **Admin** - Approve listings, manage users, analytics

### 🔐 Security
- JWT Authentication
- Google OAuth Login
- CSRF Protection
- Rate Limiting
- Password Hashing (bcrypt)

### 🇮🇳 Indian Market Focus
- All 28 States + 8 Union Territories
- 500+ cities with district data
- Price data for 20+ metro cities
- INR formatting (Lakhs, Crores)

---

## 🚀 Quick Start (Windows)

### Prerequisites
- Python 3.9+ → [Download](https://www.python.org/downloads/)
- Node.js 18+ → [Download](https://nodejs.org/)
- PostgreSQL → [Download](https://www.postgresql.org/download/)
- Git → [Download](https://git-scm.com/)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/real_estate_ai.git
cd real_estate_ai
```

### Step 2: Backend Setup
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env with your database credentials
```

### Step 3: Database Setup
```bash
# Create PostgreSQL database
# Open pgAdmin or terminal:
# CREATE DATABASE infynest_db;

# Initialize database with tables and seed data
python -m backend.seed_data
```

### Step 4: Start Backend
```bash
python run.py
# Server starts at http://localhost:5000
```

### Step 5: Frontend Setup
```bash
cd frontend
npm install
npm start
# React app starts at http://localhost:3000
```

---

## 📁 Project Structure

```
real_estate_ai/
├── backend/
│   ├── app.py              # Flask app factory
│   ├── config.py           # Configuration
│   ├── seed_data.py        # Database seeding
│   ├── models/
│   │   ├── user.py         # User model (4 roles)
│   │   ├── property.py     # Property model (11 types)
│   │   ├── location.py     # Indian locations
│   │   ├── visit.py        # Visit scheduling
│   │   ├── review.py       # Reviews
│   │   └── saved_property.py
│   └── routes/
│       ├── auth.py         # Authentication endpoints
│       ├── properties.py   # CRUD + search
│       ├── locations.py    # States/Cities API
│       ├── ai_predictions.py # AI prediction engine
│       ├── admin.py        # Admin management
│       └── users.py        # User dashboard
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/     # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── PropertiesPage.js
│   │   │   ├── PropertyDetailPage.js
│   │   │   ├── AIPredictor.js
│   │   │   ├── ComparePage.js
│   │   │   ├── AddPropertyPage.js
│   │   │   └── dashboards/
│   │   │       ├── BuyerDashboard.js
│   │   │       ├── SellerDashboard.js
│   │   │       ├── AgentDashboard.js
│   │   │       └── AdminDashboard.js
│   │   ├── services/
│   │   │   └── api.js      # Axios API client
│   │   ├── App.js          # Main app + routing
│   │   └── index.css       # Tailwind + custom styles
│   ├── tailwind.config.js
│   └── package.json
├── requirements.txt
├── run.py
├── Procfile
├── render.yaml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/forgot-password` | Request reset link |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/me` | Get current user |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties/` | List with filters |
| POST | `/api/properties/` | Create listing |
| GET | `/api/properties/:id` | Get details |
| PUT | `/api/properties/:id` | Update |
| DELETE | `/api/properties/:id` | Delete |
| GET | `/api/properties/featured` | Featured properties |
| POST | `/api/properties/compare` | Compare multiple |

### AI Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/predict-price` | Price prediction |
| POST | `/api/ai/investment-score` | Investment rating |
| POST | `/api/ai/roi-calculator` | ROI projection |
| POST | `/api/ai/rental-yield` | Rental yield |
| GET | `/api/ai/market-trends` | Market analysis |

---

## 🎨 UI Features

- **Glassmorphism** effects with backdrop blur
- **Gradient** backgrounds and text
- **Dark/Light** mode toggle
- **Smooth animations** and hover effects
- **Mobile responsive** (all screen sizes)
- **Premium typography** (Inter + Jakarta Sans)

---

## 🚀 Deployment

### Render (Recommended)
1. Push code to GitHub
2. Connect repository on [Render Dashboard](https://render.com)
3. Use `render.yaml` for auto-configuration
4. Set environment variables

### Vercel (Frontend)
```bash
cd frontend
npx vercel
```

### Railway (Backend)
```bash
railway login
railway init
railway up
```

---

## 🔐 Default Admin Login
- **Email:** admin@infynest.ai
- **Password:** Admin@123

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Framer Motion |
| Backend | Python Flask, SQLAlchemy |
| Database | PostgreSQL |
| AI/ML | Scikit-learn, XGBoost, CatBoost |
| Auth | JWT, Google OAuth, bcrypt |
| Deployment | Render, Vercel, Railway |

---

## 📄 License

MIT License - Built with ❤️ for India

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

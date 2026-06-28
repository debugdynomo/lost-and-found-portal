# 🔍 Lost & Found Portal

A full-stack MERN application for college students to report and discover lost & found items on campus. Built with React, Express, MongoDB, and Cloudinary.

![Node.js](https://img.shields.io/badge/Node.js-v20+-green?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-blue?logo=tailwindcss)

---

## ✨ Features

### Authentication
- User registration with name, email and password
- Login/logout with JWT stored in httpOnly cookies
- Protected routes for authenticated users

### Items
- Report lost or found items with images
- Upload multiple images via Cloudinary
- Search items by title/description (text search)
- Filter by type (lost/found), category, and sort order
- Pagination with 12 items per page
- Edit and delete your own posts

### Claims
- Submit claims on items you recognize
- Item owners can approve or reject claims
- Auto-reject other claims when one is approved
- View sent and received claims on dashboard

### Dashboard
- Statistics: total items posted, resolved items, active claims
- Manage your items (edit, delete)
- Manage incoming claims (approve/reject)
- Track outgoing claim statuses

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookie) |
| Images | Cloudinary + Multer |
| Styling | Tailwind CSS v4 |

---

## 📁 Folder Structure

```
Lost and Found app/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # ProtectedRoute
│   │   │   ├── items/         # ItemCard
│   │   │   └── layout/        # Navbar, Footer
│   │   ├── context/           # AuthContext
│   │   ├── pages/             # Home, Items, ItemDetail, PostItem, Dashboard, Login, Register, NotFound
│   │   ├── utils/             # api.js (Axios)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                    # Express backend
│   ├── config/                # db.js, cloudinary.js
│   ├── controllers/           # auth, item, claim, user controllers
│   ├── middleware/             # auth.js, error.js, upload.js
│   ├── models/                # User, Item, Claim
│   ├── routes/                # auth, item, claim, user routes
│   ├── utils/                 # ApiError, asyncHandler
│   ├── app.js
│   └── server.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **MongoDB Atlas** account (free tier)
- **Cloudinary** account (free tier)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "Lost and Found app"
```

### 2. Server Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/lost-and-found?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:

```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

### 3. Client Setup

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` requests to `http://localhost:5000`.

---

## 📡 API Endpoints

### Auth
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| POST | `/api/auth/logout` | Logout user | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Items
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| GET | `/api/items` | Get all items (with search/filters) | Public |
| GET | `/api/items/:id` | Get single item | Public |
| POST | `/api/items` | Create item | Private |
| PUT | `/api/items/:id` | Update item (owner only) | Private |
| DELETE | `/api/items/:id` | Delete item (owner only) | Private |
| GET | `/api/items/my-items` | Get user's items | Private |

### Claims
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/api/claims` | Submit a claim | Private |
| GET | `/api/claims/received` | Get claims on your items | Private |
| GET | `/api/claims/sent` | Get your submitted claims | Private |
| PATCH | `/api/claims/:id/respond` | Approve/reject a claim | Private |

### Users
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| PUT | `/api/users/profile` | Update profile | Private |
| GET | `/api/users/stats` | Get dashboard stats | Private |

---

## 🔧 Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|------------|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment (development/production) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | JWT expiration (e.g., 7d) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## 🚢 Deployment

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set root directory to `server`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables

### Frontend (Vercel)
1. Import project on [Vercel](https://vercel.com)
2. Set root directory to `client`
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 📝 License

This project is built for educational purposes as part of a full-stack web development internship.

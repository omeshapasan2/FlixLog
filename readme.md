# FlixLog

![FlixLog](https://res.cloudinary.com/dldgeyki5/image/upload/v1748414381/wvosayqdlat913agwick.gif)


FlixLog is a React app that helps users discover movies and TV series, manage favorites and watchlists, and track ongoing shows — all with a clean, modern interface powered by Firebase.
### [🔗 Visit Live Site](https://flixlog.omeshapasan.site)

# 🚀 Getting Started

Here's a guide to get the Application Running.

## 📦 Installation

Install all required dependencies:

```bash
npm install react react-dom react-router-dom @types/react @types/react-dom
npm install firebase @react-firebase/auth @react-firebase/firestore
npm install lucide-react react-toastify @dotlottie/react-player
npm install lodash.debounce react-select react-select/async
npm install --save-dev @types/react-select @types/lodash.debounce
```

## 🔐 Environment Variables

Place the .env file in the root of the FlixLog project (i.e., inside the FlixLog folder but outside the src folder):

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

## 🌐 How to Get These Keys

### 🔹 1. TMDb API Key

1. Go to [https://www.themoviedb.org](https://www.themoviedb.org)
2. Sign up or log in.
3. Visit [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
4. Click **Create** under Developer Key.
5. Copy the API Key (v3 auth) and use it as:

```
VITE_TMDB_API_KEY=your_key
```

### 🔹 2. Firebase Configuration

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create or open a project.
3. Click the Web (</>) icon to register a web app.
4. Firebase will generate a config object like:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

5. Map these values to your `.env`:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## ✅ Run the Application

```bash
cd FlixLog
npm run dev
```

## 🧩 Features

- 🔍 Search for movies and series.
- 📊 Filter content by various factors such as Year, Cast, Rating, Anime, Drama, Movie, Series, and more.
- ⭐ Add to Favorites.
- 📺 Organize your Watchlist.
- 📡 Keep up with Ongoing shows.
- 🔐 Firebase Authentication (login/register).
- 🎨 Clean, responsive UI.
- 📬 Toast notifications.
- ⏳ Preloader for better UX.

## 🗂️ Project Structure

```
src/
│   App.css
│   App.jsx
│   index.css
│   main.jsx
│
├───api/                   # API utilities and Firebase config
│   ├── api.js
│   └── firebase.js
│
├───assets/                # Static assets
│   └── react.svg
│
├───components/            # Reusable UI components
│   ├── ActorFilter.jsx
│   ├── Card.jsx
│   ├── Filter.jsx
│   ├── NavBar.jsx
│   ├── OngoingCard.jsx
│   ├── PreLoader.jsx
│   ├── SearchBar.jsx
│   └── ui/
│       └── switch.tsx
│
├───context/               # Context API for state management
│   ├── AuthContext.jsx
│   └── MoviesSeriesContext.jsx
│
├───lib/                   # Utility functions
│   └── utils.ts
│
└───pages/                 # Route-based pages
    ├── Details.jsx
    ├── Favorites.jsx
    ├── Home.jsx
    ├── Login.jsx
    ├── Ongoing.jsx
    ├── Register.jsx
    └── WatchList.jsx
```



## 🛠 Tech Stack

- React + Vite
- Firebase (Auth & Firestore)
- React Router DOM
- Lucide React for icons
- React Toastify for notifications
- DotLottie Player for PreLoader
- React Select for dropdown filters
- Lodash Debounce for search optimization

## 📌 Future Improvements

- User profile pages and Settings
- Notifications for new episodes
- Better WatchList Management
- Android App

## 📃 License

MIT License

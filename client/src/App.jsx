import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react'
import './App.css'
import ForumPage from "./pages/ForumPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AskQuestionPage from "./pages/AskQuestionPage";
import SingleQuestionPage from "./pages/SingleQuestionPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ListOfUsersPage from "./pages/ListOfUsersPage";

function App() {

  return (
    <div className="wrapper">
      {/* <Navbar /> */}
      {/* <Sidebar /> */}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/questions" />} />
          <Route path="/questions" element={<ForumPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ask" element={<AskQuestionPage />} />
          <Route path="/questions/:questionId" element={<SingleQuestionPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/users" element={< ListOfUsersPage/>} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App




/*
//Original
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/

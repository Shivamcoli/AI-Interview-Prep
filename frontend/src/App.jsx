
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/InterviewPrep/LandingPage"
import Login from "./pages/Login"
import SignUp from "./pages/Signup"
import { Dashboard } from "./pages/InterviewPrep/Dashboard"
import InterviewPrep from "./pages/InterviewPrep/components/InterviewPrep"
import { Toaster } from "react-hot-toast"
import UserProvider from "./context/UserProvider"

function App() {

  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
          </Routes>
        </Router>
        <Toaster
        />
      </div>
    </UserProvider>
  )
}

export default App

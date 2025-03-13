import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
//import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import Notifications from "./components/Notifications";
import Chat from "./components/Chat";
import UserAnalytics from "./components/UserAnalytics";
import EmployerAnalytics from "./components/EmployerAnalytics";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PrivateRoute><PostJob /></PrivateRoute>} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/analytics" element={<UserAnalytics />} />
          <Route path="/employer-analytics" element={<EmployerAnalytics />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import PrivateRoute from "@/components/PrivateRoute";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RegisterWithRG from "@/pages/RegisterWithRG";
import RecoverPassword from "@/pages/RecoverPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Appointments from "@/pages/Appointments";
import Symptoms from "@/pages/Symptoms";
import TelemedicineWait from "@/pages/TelemedicineWait";
import Telemedicine from "@/pages/Telemedicine";
import Documents from "@/pages/Documents";
import Chatbot from "@/pages/Chatbot";
import Feedback from "@/pages/Feedback";
import Gamification from "@/pages/Gamification";
import Notifications from "@/pages/Notifications";
import LoginDoctor from "@/pages/LoginDoctor";
import DiagnoseValidation from "@/pages/DiagnoseValidation";
import Reception from "@/pages/Reception";
import WaitingRoom from "@/pages/WaitingRoom";
import InPerson from "@/pages/InPerson";
import Medication from "@/pages/Medication";
import ExamScheduling from "@/pages/ExamScheduling";
import Pharmacy from "@/pages/Pharmacy";
import ICU from "@/pages/ICU";
import AdminReports from "@/pages/AdminReports";
import Wearables from "@/pages/Wearables";
import Tutorial from "@/pages/Tutorial";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-with-rg" element={<RegisterWithRG />} />
          <Route path="/recuperar-senha" element={<RecoverPassword />} />
          <Route path="/redefinir-senha" element={<ResetPassword />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            }
          />
          <Route
            path="/symptoms"
            element={
              <PrivateRoute>
                <Symptoms />
              </PrivateRoute>
            }
          />
          <Route
            path="/telemedicine-wait"
            element={
              <PrivateRoute>
                <TelemedicineWait />
              </PrivateRoute>
            }
          />
          <Route
            path="/telemedicine"
            element={
              <PrivateRoute>
                <Telemedicine />
              </PrivateRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <PrivateRoute>
                <Documents />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <PrivateRoute>
                <Chatbot />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback"
            element={
              <PrivateRoute>
                <Feedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/gamification"
            element={
              <PrivateRoute>
                <Gamification />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route path="/login-doctor" element={<LoginDoctor />} />
          <Route
            path="/diagnose-validation"
            element={
              <PrivateRoute>
                <DiagnoseValidation />
              </PrivateRoute>
            }
          />
          <Route
            path="/reception"
            element={
              <PrivateRoute>
                <Reception />
              </PrivateRoute>
            }
          />
          <Route
            path="/waiting-room"
            element={
              <PrivateRoute>
                <WaitingRoom />
              </PrivateRoute>
            }
          />
          <Route
            path="/in-person"
            element={
              <PrivateRoute>
                <InPerson />
              </PrivateRoute>
            }
          />
          <Route
            path="/medication"
            element={
              <PrivateRoute>
                <Medication />
              </PrivateRoute>
            }
          />
          <Route
            path="/exam-scheduling"
            element={
              <PrivateRoute>
                <ExamScheduling />
              </PrivateRoute>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <PrivateRoute>
                <Pharmacy />
              </PrivateRoute>
            }
          />
          <Route
            path="/icu"
            element={
              <PrivateRoute>
                <ICU />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-reports"
            element={
              <PrivateRoute>
                <AdminReports />
              </PrivateRoute>
            }
          />
          <Route
            path="/wearables"
            element={
              <PrivateRoute>
                <Wearables />
              </PrivateRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

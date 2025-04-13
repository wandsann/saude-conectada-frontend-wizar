import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Star,
  FileText,
  Bell,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="w-64 bg-[#0055FF] text-white p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">{t("health_connected")}</h2>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <Home className="mr-2 h-5 w-5" />
            {t("dashboard")}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <User className="mr-2 h-5 w-5" />
            {t("profile")}
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <Calendar className="mr-2 h-5 w-5" />
            {t("appointments")}
          </NavLink>
          <NavLink
            to="/symptoms"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            {t("symptoms_form")}
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <FileText className="mr-2 h-5 w-5" />
            {t("documents")}
          </NavLink>
          <NavLink
            to="/chatbot"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            {t("chatbot")}
          </NavLink>
          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <Star className="mr-2 h-5 w-5" />
            {t("feedback_title")}
          </NavLink>
          <NavLink
            to="/gamification"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <Star className="mr-2 h-5 w-5" />
            {t("gamification_title")}
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg ${
                isActive ? "bg-white text-[#0055FF]" : "hover:bg-[#E6F0FF] hover:text-[#0055FF]"
              }`
            }
          >
            <Bell className="mr-2 h-5 w-5" />
            {t("notifications")}
          </NavLink>
        </nav>
      </div>
      <Button
        onClick={handleLogout}
        className="flex items-center bg-transparent border border-white text-white hover:bg-white hover:text-[#0055FF]"
      >
        <LogOut className="mr-2 h-5 w-5" />
        {t("logout")}
      </Button>
    </div>
  );
}

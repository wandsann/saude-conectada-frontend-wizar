import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function TelemedicineWait() {
  const [timeLeft, setTimeLeft] = useState(165); // 2:45
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          navigate("/telemedicine");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    toast({
      title: t("consultation_canceled"),
      description: t("returned_to_dashboard"),
    });
    navigate("/dashboard");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-[#0055FF]">{t("waiting_for_doctor")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <motion.p
                className="text-2xl font-bold text-[#0055FF]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 10 }}
              >
                {formatTime(timeLeft)}
              </motion.p>
              <motion.div
                className="w-full bg-[#E6F0FF] rounded-full h-4 mt-4"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 165, ease: "linear" }}
              >
                <div className="bg-[#0055FF] h-4 rounded-full"></div>
              </motion.div>
              <p className="mt-4 text-base">{t("connecting_to_doctor")}</p>
              <div className="flex justify-center mt-4">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Doctor Avatar"
                  className="rounded-full"
                />
              </div>
              <p className="mt-2 text-sm">{t("connection_status")}: <span className="text-green-500">{t("good")}</span></p>
              <motion.div whileTap={{ scale: 1.1 }}>
                <Button
                  onClick={handleCancel}
                  className="mt-4 bg-gray-500 text-white h-10 rounded-lg"
                >
                  {t("cancel")}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>{t("confirm_cancel")}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button onClick={() => setShowCancelModal(false)}>{t("no")}</Button>
                <Button onClick={confirmCancel} className="bg-red-500 text-white">
                  {t("yes")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

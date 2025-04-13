import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function Telemedicine() {
  const [chatMessage, setChatMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleEndConsultation = async () => {
    const { error } = await supabase
      .from("consults")
      .insert({
        diagnosis: "Resfriado",
        prescription: "Antialérgico, repouso",
        doctor_name: "Dr. Silva",
      });

    if (error) {
      toast({
        title: t("error_ending_consultation"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("consultation_ended"),
      description: t("redirecting_to_documents"),
    });
    navigate("/documents");
  };

  const handleSendMessage = () => {
    toast({
      title: t("message_sent"),
      description: chatMessage,
    });
    setChatMessage("");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0055FF]">{t("telemedicine_call")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-[#0055FF] font-bold">{t("doctor_video")}</p>
                </div>
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-300 flex items-center justify-center">
                  {cameraOn ? (
                    <p className="text-[#0055FF] font-bold">{t("patient_video")}</p>
                  ) : (
                    <p className="text-gray-500">{t("camera_off")}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <p>{t("doctor_info")}</p>
                <div className="flex gap-2">
                  <Button onClick={() => setCameraOn(!cameraOn)}>
                    {cameraOn ? t("turn_off_camera") : t("turn_on_camera")}
                  </Button>
                  <Button onClick={() => setShowChat(true)}>{t("open_chat")}</Button>
                  <Button onClick={handleEndConsultation} className="bg-red-500 text-white">
                    {t("end_call")}
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-[#E6F0FF] rounded-lg">
                <p><strong>{t("ai_suggestion")}:</strong> {t("ai_resfriado")}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {showChat && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-0 right-0 w-80 bg-white p-4 rounded-t-lg shadow-lg"
          >
            <h3 className="text-lg font-bold">{t("chat")}</h3>
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={t("type_message")}
              className="mt-2"
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button onClick={() => setShowChat(false)}>{t("close")}</Button>
              <Button onClick={handleSendMessage} className="bg-[#0055FF] text-white">
                {t("send")}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

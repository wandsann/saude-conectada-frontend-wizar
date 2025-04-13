import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSendMessage = () => {
    if (!message) {
      toast({
        title: t("error"),
        description: t("type_message"),
        variant: "destructive",
      });
      return;
    }

    const botResponse = t("bot_response");
    setChatHistory([...chatHistory, { user: message, bot: botResponse }]);
    setMessage("");
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
              <CardTitle className="text-[#0055FF]">{t("chatbot")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 overflow-y-auto mb-4 p-4 bg-[#E6F0FF] rounded-lg">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>{t("you")}:</strong> {chat.user}</p>
                    <p><strong>{t("bot")}:</strong> {chat.bot}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("type_message")}
                />
                <motion.div whileTap={{ scale: 1.1 }}>
                  <Button onClick={handleSendMessage} className="bg-[#0055FF] text-white">
                    {t("send")}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

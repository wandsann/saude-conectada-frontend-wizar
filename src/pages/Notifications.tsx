import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase.from("notifications").select("*");

    if (error) {
      toast({
        title: t("error_loading_notifications"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNotifications(data || []);
  };

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      toast({
        title: t("error_marking_read"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNotifications(notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
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
              <CardTitle className="text-[#0055FF]">{t("notifications")}</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p>{t("no_notifications")}</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg ${notif.read ? "bg-gray-200" : "bg-[#E6F0FF]"}`}
                    >
                      <p><strong>{t("date")}:</strong> {new Date(notif.created_at).toLocaleString()}</p>
                      <p>{notif.message}</p>
                      {!notif.read && (
                        <motion.div whileTap={{ scale: 1.1 }}>
                          <Button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="mt-2 bg-[#0055FF] text-white"
                          >
                            {t("mark_as_read")}
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

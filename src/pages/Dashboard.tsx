import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [points, setPoints] = useState(45);
  const [notifications, setNotifications] = useState(2);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
    fetchHistory();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("patients").select("*");
    setLoading(false);

    if (error) {
      toast({
        title: t("error_loading_patients"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPatients(data || []);
  };

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patients (
          cpf,
          email
        )
      `);

    if (error) {
      toast({
        title: t("error_loading_appointments"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setAppointments(data || []);
  };

  const fetchHistory = async () => {
    const { data, error } = await supabase.from("consults").select("*");

    if (error) {
      toast({
        title: t("error_loading_history"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setHistory(data || []);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0055FF]">{t("welcome")}</h1>
          <div className="flex items-center gap-2">
            <motion.div whileTap={{ scale: 1.1 }}>
              <Button
                onClick={() => navigate("/notifications")}
                className="relative bg-[#0055FF] text-white"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
                    {notifications}
                  </span>
                )}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 1.1 }}>
              <Button
                onClick={() => navigate("/profile")}
                className="bg-[#0055FF] text-white"
              >
                {t("edit_profile")}
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("gamification_points")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pt-1">
                <motion.div
                  className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-[#E6F0FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(points / 50) * 100}%` }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#0055FF]"></div>
                </motion.div>
                <p className="text-sm">{points}/50 {t("points")}</p>
              </div>
              <Button onClick={() => navigate("/gamification")}>{t("redeem_rewards")}</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("patients")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>{t("loading")}</p>
              ) : patients.length === 0 ? (
                <p>{t("no_patients")}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("cpf")}</TableHead>
                      <TableHead>{t("email")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.cpf}</TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            {t("view_details")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t("appointments")}</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p>{t("no_appointments")}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("patient")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                      <TableHead>{t("description")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patients?.cpf} ({appointment.patients?.email})</TableCell>
                        <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                        <TableCell>{appointment.description || t("no_description")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t("history")}</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p>{t("no_history")}</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="p-4 bg-[#E6F0FF] rounded-lg">
                      <p><strong>{t("date")}:</strong> {new Date(entry.created_at).toLocaleString()}</p>
                      <p><strong>{t("diagnosis")}:</strong> {entry.diagnosis || t("no_diagnosis")}</p>
                      <p><strong>{t("doctor")}:</strong> {entry.doctor_name || "Dr. Silva"}</p>
                    </div>
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

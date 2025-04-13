import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

export default function RegisterWithRG() {
  const [name, setName] = useState("Maria Silva");
  const [cpf, setCpf] = useState("123.456.789-00");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [phone, setPhone] = useState("+5511987654321");
  const [email, setEmail] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!lgpdConsent) {
      setError(t("lgpd_required"));
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email: email || `${cpf.replace(/\D/g, '')}@temp.com`,
      password: "temp1234",
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      toast({
        title: t("register_error"),
        description: authError.message,
        variant: "destructive",
      });
      return;
    }

    const { error: patientError } = await supabase
      .from("patients")
      .insert({ cpf: cpf.replace(/\D/g, ""), email: email || `${cpf.replace(/\D/g, '')}@temp.com` });

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ username: name.split(" ")[0].toLowerCase(), email: email || `${cpf.replace(/\D/g, '')}@temp.com` });

    setLoading(false);

    if (patientError || profileError) {
      setError(patientError?.message || profileError?.message || t("error_saving_data"));
      toast({
        title: t("error_saving_data"),
        description: patientError?.message || profileError?.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("register_success"),
      description: t("registered_successfully"),
    });
    setTimeout(() => navigate("/symptoms"), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFFFFF]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-4 border-[#0055FF]">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0055FF]">{t("register_with_rg")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center border-4 border-[#0055FF] rounded-lg">
                <p className="text-[#0055FF] font-bold">{t("rg_detected")}</p>
              </div>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="cpf">{t("cpf")}</Label>
                  <Input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="birthDate">{t("birth_date")}</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")} ({t("optional")})</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lgpd"
                    checked={lgpdConsent}
                    onCheckedChange={(checked) => setLgpdConsent(checked as boolean)}
                  />
                  <Label htmlFor="lgpd">
                    {t("lgpd_consent")} <a href="#" className="text-[#0055FF] underline">{t("terms")}</a>
                  </Label>
                </div>
              </motion.div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <motion.div whileTap={{ scale: 1.1 }}>
                <Button
                  type="submit"
                  className="w-full bg-[#0055FF] text-white h-12 rounded-lg text-base font-bold"
                  disabled={loading || !lgpdConsent}
                >
                  {loading ? t("registering") : t("confirm_data")}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

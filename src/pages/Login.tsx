import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import LibrasToggle from "@/components/LibrasToggle";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showLibrasModal, setShowLibrasModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(cpf, password);
      toast({
        title: t("login_success"),
        description: t("welcome_message"),
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: t("login_error"),
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#0055FF] to-[#FFFFFF]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 right-4 flex gap-2"
      >
        <LanguageSelector />
        <LibrasToggle />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold text-[#0055FF]">{t("welcome")}</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">{t("cpf")}</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                  className="text-base"
                  aria-label={t("cpf")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-base pr-10"
                    aria-label={t("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                  </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/recuperar-senha")}
                  className="text-[#0055FF] underline"
                >
                  {t("forgot_password")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLibrasModal(true)}
                  className="text-[#0055FF] underline"
                >
                  {t("libras_help")}
                </button>
              </div>
              <motion.div whileTap={{ scale: 1.1 }}>
                <Button
                  type="submit"
                  className="w-full bg-[#0055FF] text-white h-12 rounded-lg text-base font-bold"
                  disabled={loading}
                >
                  {loading ? t("logging_in") : t("login")}
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 1.1 }}>
                <Button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="w-full bg-transparent border border-white text-white h-12 rounded-lg text-base font-bold mt-2 flex items-center justify-center gap-2"
                >
                  <span>{t("register_with_rg")}</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6" />
                  </svg>
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {showLibrasModal && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="bg-white p-4 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">{t("libras_help")}</h3>
            <video
              src="https://vlibras.gov.br/app/videos/explicacao-login.mp4"
              controls
              autoPlay
              className="w-full h-48"
              onPause={() => setShowLibrasModal(false)}
            />
            <Button onClick={() => setShowLibrasModal(false)} className="mt-2">
              {t("close")}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

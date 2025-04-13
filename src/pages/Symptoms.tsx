import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [vitalSigns, setVitalSigns] = useState({
    pressure: "",
    saturation: "",
    temperature: "",
    heartRate: "",
  });
  const [showVitalSigns, setShowVitalSigns] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const symptomList = [
    "Dor de cabeça",
    "Febre",
    "Tosse",
    "Dor de garganta",
    "Fadiga",
    "Náusea",
    "Dor abdominal",
    "Falta de ar",
  ];

  const handleSymptomChange = (symptom: string) => {
    setSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (symptoms.length === 0) {
      toast({
        title: t("error"),
        description: t("select_symptom"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("triages")
      .insert({
        symptoms,
        description,
        vital_signs: showVitalSigns ? vitalSigns : null,
        severity: symptoms.includes("Falta de ar") ? "severe" : symptoms.length > 2 ? "moderate" : "simple",
      });

    if (error) {
      toast({
        title: t("error_saving_triage"),
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: t("triage_success"),
      description: t("triage_submitted"),
    });
    setTimeout(() => navigate("/telemedicine-wait"), 2000);
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
              <CardTitle className="text-[#0055FF]">{t("symptoms_form")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>{t("select_symptoms")}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {symptomList.map((symptom) => (
                      <motion.div
                        key={symptom}
                        className="flex items-center space-x-2"
                        whileTap={{ scale: 1.2 }}
                      >
                        <Checkbox
                          id={symptom}
                          checked={symptoms.includes(symptom)}
                          onCheckedChange={() => handleSymptomChange(symptom)}
                        />
                        <Label htmlFor={symptom}>{symptom}</Label>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">{t("describe_symptoms")}</Label>
                  <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={300}
                    placeholder={t("describe_symptoms_placeholder")}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showVitalSigns ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {showVitalSigns && (
                    <div className="space-y-2">
                      <Label>{t("vital_signs")}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="pressure">{t("blood_pressure")}</Label>
                          <Input
                            id="pressure"
                            type="text"
                            placeholder="120/80"
                            value={vitalSigns.pressure}
                            onChange={(e) =>
                              setVitalSigns({ ...vitalSigns, pressure: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="saturation">{t("oxygen_saturation")}</Label>
                          <Input
                            id="saturation"
                            type="text"
                            placeholder="98%"
                            value={vitalSigns.saturation}
                            onChange={(e) =>
                              setVitalSigns({ ...vitalSigns, saturation: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="temperature">{t("temperature")}</Label>
                          <Input
                            id="temperature"
                            type="text"
                            placeholder="36.5°C"
                            value={vitalSigns.temperature}
                            onChange={(e) =>
                              setVitalSigns({ ...vitalSigns, temperature: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="heartRate">{t("heart_rate")}</Label>
                          <Input
                            id="heartRate"
                            type="text"
                            placeholder="80 bpm"
                            value={vitalSigns.heartRate}
                            onChange={(e) =>
                              setVitalSigns({ ...vitalSigns, heartRate: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                <motion.div whileTap={{ scale: 1.1 }}>
                  <Button
                    type="button"
                    onClick={() => setShowVitalSigns(!showVitalSigns)}
                    className="w-full bg-[#0055FF] text-white h-12 rounded-lg text-base font-bold"
                  >
                    {showVitalSigns ? t("hide_vital_signs") : t("measure_vital_signs")}
                  </Button>
                </motion.div>
                <motion.div whileTap={{ scale: 1.1 }}>
                  <Button
                    type="submit"
                    className="w-full bg-[#0055FF] text-white h-12 rounded-lg text-base font-bold"
                    disabled={loading || symptoms.length === 0}
                  >
                    {loading ? t("submitting") : t("confirm")}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

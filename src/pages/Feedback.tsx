import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";
import { Star } from "lucide-react";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (rating === 0) {
      toast({
        title: t("error"),
        description: t("select_rating"),
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("feedbacks")
      .insert({ rating, comment });

    if (error) {
      toast({
        title: t("error_saving_feedback"),
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: t("feedback_success"),
      description: t("feedback_submitted"),
    });
    setTimeout(() => navigate("/dashboard"), 2000);
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
              <CardTitle className="text-[#0055FF]">{t("feedback_title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>{t("rating")}</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        whileTap={{ scale: 1.2 }}
                      >
                        <Star
                          className={`h-6 w-6 cursor-pointer ${
                            star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">{t("comment")}</Label>
                  <Input
                    id="comment"
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t("comment_placeholder")}
                  />
                </div>
                <motion.div whileTap={{ scale: 1.1 }}>
                  <Button
                    type="submit"
                    className="w-full bg-[#0055FF] text-white h-12 rounded-lg text-base font-bold"
                    disabled={loading || rating === 0}
                  >
                    {loading ? t("submitting") : t("submit")}
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

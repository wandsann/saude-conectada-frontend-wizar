import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function Gamification() {
  const [points, setPoints] = useState(0);
  const [rewards, setRewards] = useState<any[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchPoints();
    fetchRewards();
  }, []);

  const fetchPoints = async () => {
    const { data, error } = await supabase
      .from("points")
      .select("points")
      .single();

    if (error) {
      toast({
        title: t("error_loading_points"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPoints(data?.points || 0);
  };

  const fetchRewards = async () => {
    const { data } = await supabase
      .from("points")
      .select("*");

    setRewards([{ id: 1, name: t("discount_10"), cost: 50 }]);
  };

  const handleRedeem = async (rewardId: number, cost: number) => {
    if (points < cost) {
      toast({
        title: t("error"),
        description: t("insufficient_points"),
        variant: "destructive",
      });
      return;
    }

    const newPoints = points - cost;
    const { error } = await supabase
      .from("points")
      .update({ points: newPoints })
      .eq("id", 1);

    if (error) {
      toast({
        title: t("error_redeeming"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPoints(newPoints);
    toast({
      title: t("reward_redeemed"),
      description: t("redeemed_successfully"),
    });
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
              <CardTitle className="text-[#0055FF]">{t("gamification_title")}</CardTitle>
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
              <div className="mt-4 space-y-2">
                {rewards.map((reward) => (
                  <div key={reward.id} className="p-4 bg-[#E6F0FF] rounded-lg flex justify-between items-center">
                    <p>{reward.name}</p>
                    <motion.div whileTap={{ scale: 1.1 }}>
                      <Button
                        onClick={() => handleRedeem(reward.id, reward.cost)}
                        className="bg-[#0055FF] text-white"
                      >
                        {t("redeem")} ({reward.cost} {t("points")})
                      </Button>
                    </motion.div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

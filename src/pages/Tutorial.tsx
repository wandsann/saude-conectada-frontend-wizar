import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Tutorial() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0055FF]">{t("tutorial")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("coming_soon")}</p>
          <Button onClick={() => navigate("/")} className="mt-4 bg-[#0055FF] text-white">
            {t("skip")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

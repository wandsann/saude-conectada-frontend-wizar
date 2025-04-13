import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

export default function LoginDoctor() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#0055FF] to-[#FFFFFF]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-[#0055FF]">{t("doctor_login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("coming_soon")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

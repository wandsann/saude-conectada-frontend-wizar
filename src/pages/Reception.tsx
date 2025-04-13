import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';

export default function Reception() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0055FF]">{t("reception")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t("coming_soon")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function ICU() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#0055FF]">{t("icu_monitoring")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("coming_soon")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

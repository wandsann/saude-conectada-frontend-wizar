import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import Sidebar from "@/components/Sidebar";

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("documents").select("*");
    setLoading(false);

    if (error) {
      toast({
        title: t("error_loading_documents"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setDocuments(data || []);
  };

  const handleShare = (documentId: string) => {
    toast({
      title: t("document_shared"),
      description: t("shared_via_email"),
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-[#0055FF]">{t("documents")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>{t("loading")}</p>
              ) : documents.length === 0 ? (
                <p>{t("no_documents")}</p>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="p-4 bg-[#E6F0FF] rounded-lg"
                    >
                      <p><strong>{t("type")}:</strong> {doc.type}</p>
                      <p><strong>{t("date")}:</strong> {new Date(doc.created_at).toLocaleString()}</p>
                      <p><strong>{t("validity")}:</strong> {t("expires_in")} 25 {t("days")}</p>
                      <div className="mt-2 flex gap-2">
                        <Button>{t("download")}</Button>
                        <Button onClick={() => handleShare(doc.id)}>{t("share")}</Button>
                      </div>
                    </motion.div>
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

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ patientCpf: "", date: "", description: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select(`
        *,
        patients (
          cpf,
          email
        )
      `);
    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao carregar consultas",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setAppointments(data || []);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Busca o patient_id pelo CPF
    const { data: patient, error: patientError } = await supabase
      .from("patients")
      .select("id")
      .eq("cpf", newAppointment.patientCpf.replace(/\D/g, ""))
      .single();

    if (patientError || !patient) {
      setLoading(false);
      toast({
        title: "Erro",
        description: "Paciente não encontrado",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .insert({
        patient_id: patient.id,
        date: newAppointment.date,
        description: newAppointment.description,
      });

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao criar consulta",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Consulta criada",
      description: "Consulta criada com sucesso!",
    });
    setNewAppointment({ patientCpf: "", date: "", description: "" });
    fetchAppointments();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nova Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientCpf">CPF do Paciente</Label>
                <Input
                  id="patientCpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={newAppointment.patientCpf}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientCpf: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data e Hora</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="Descrição da consulta"
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar Consulta"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : appointments.length === 0 ? (
              <p>Nenhuma consulta encontrada.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patients?.cpf} ({appointment.patients?.email})</TableCell>
                      <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                      <TableCell>{appointment.description || "Sem descrição"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

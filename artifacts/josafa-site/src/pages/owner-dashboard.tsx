import { useState, useEffect } from "react";
import { useListAppointments } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, XCircle, RefreshCw } from "lucide-react";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

const statusConfig: Record<AppointmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "secondary" },
  confirmed: { label: "Confirmado", variant: "default" },
  completed: { label: "Concluído", variant: "outline" },
  cancelled: { label: "Cancelado", variant: "destructive" },
};

async function updateStatus(id: number, status: AppointmentStatus) {
  await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
}

export function OwnerDashboard() {
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const { data: appointments, isLoading, refetch } = useListAppointments();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { isOwner: boolean }) => {
        if (!d.isOwner) {
          window.location.href = "/proprietario";
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => {
        window.location.href = "/proprietario";
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/proprietario";
  };

  const handleStatusChange = async (id: number, status: AppointmentStatus) => {
    setUpdatingId(id);
    await updateStatus(id, status);
    await refetch();
    setUpdatingId(null);
  };

  const filtered = (appointments ?? []).filter(
    (a) => filter === "all" || a.status === filter
  );

  const counts = {
    all: (appointments ?? []).length,
    pending: (appointments ?? []).filter((a) => a.status === "pending").length,
    confirmed: (appointments ?? []).filter((a) => a.status === "confirmed").length,
    completed: (appointments ?? []).filter((a) => a.status === "completed").length,
    cancelled: (appointments ?? []).filter((a) => a.status === "cancelled").length,
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <span className="text-lg font-serif font-bold text-primary">Josafá</span>
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Área do Proprietário</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              data-testid="button-refresh"
              className="text-muted-foreground"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              className="rounded-none text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-primary mb-1">Agendamentos</h1>
          <p className="text-muted-foreground text-sm">Gerencie os agendamentos dos seus clientes</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {(["pending", "confirmed", "completed", "cancelled"] as AppointmentStatus[]).map((s) => (
            <div key={s} className="border border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setFilter(s)} data-testid={`card-stat-${s}`}>
              <p className="text-2xl font-bold text-primary">{counts[s]}</p>
              <p className="text-xs text-muted-foreground mt-1">{statusConfig[s].label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
              data-testid={`button-filter-${s}`}
              className="rounded-none text-xs h-8"
            >
              {s === "all" ? `Todos (${counts.all})` : `${statusConfig[s].label} (${counts[s]})`}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Carregando agendamentos...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-lg">
            Nenhum agendamento encontrado
          </div>
        ) : (
          <div className="space-y-3" data-testid="list-appointments">
            {filtered.map((appt) => {
              const status = appt.status as AppointmentStatus;
              return (
                <div key={appt.id} className="border border-border rounded-lg p-5 hover:border-primary/30 transition-colors bg-card" data-testid={`card-appointment-${appt.id}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-primary text-sm" data-testid={`text-appt-name-${appt.id}`}>{appt.name}</h3>
                        <Badge variant={statusConfig[status].variant} className="text-xs">{statusConfig[status].label}</Badge>
                        <span className="text-xs text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded">{appt.serviceName}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" />{appt.preferredDate}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 shrink-0" />{appt.preferredTime}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0" />{appt.phone}</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 shrink-0" />{appt.email}</span>
                      </div>

                      {appt.notes && (
                        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="italic">{appt.notes}</span>
                        </div>
                      )}
                    </div>

                    {status !== "completed" && status !== "cancelled" && (
                      <div className="flex flex-col gap-2 shrink-0">
                        {status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(appt.id, "confirmed")}
                            disabled={updatingId === appt.id}
                            data-testid={`button-confirm-${appt.id}`}
                            className="rounded-none text-xs h-8 bg-primary text-primary-foreground"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            Confirmar
                          </Button>
                        )}
                        {status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(appt.id, "completed")}
                            disabled={updatingId === appt.id}
                            data-testid={`button-complete-${appt.id}`}
                            className="rounded-none text-xs h-8"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            Concluir
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStatusChange(appt.id, "cancelled")}
                          disabled={updatingId === appt.id}
                          data-testid={`button-cancel-${appt.id}`}
                          className="rounded-none text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1.5" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

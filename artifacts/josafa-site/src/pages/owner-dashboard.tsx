import { useState, useEffect } from "react";
import { useListAppointments } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Calendar, Clock, Phone, Mail, FileText, CheckCircle, XCircle, RefreshCw, MessageCircle, Ban, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function formatWhatsAppUrl(phone: string, name: string, service: string, date: string, time: string): string {
  const digits = phone.replace(/\D/g, "");
  const number = digits.startsWith("55") ? digits : `55${digits}`;
  const message = `Olá ${name}, tudo bem? Sou o Josafá do estúdio Hair & Prótese Capilar. Estou entrando em contato sobre o seu agendamento de *${service}* para o dia *${date}* às *${time}*. Podemos confirmar?`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

const statusConfig: Record<AppointmentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "secondary" },
  confirmed: { label: "Confirmado", variant: "default" },
  completed: { label: "Concluído", variant: "outline" },
  cancelled: { label: "Cancelado", variant: "destructive" },
};

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

async function updateStatus(id: number, status: AppointmentStatus) {
  await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
}

type BlockedSlot = { id: number; date: string; time: string | null; reason: string | null; createdAt: string };

function useBlockedSlots() {
  const [slots, setSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blocked-slots", { credentials: "include" });
      setSlots(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return { slots, loading, reload: load };
}

export function OwnerDashboard() {
  const [tab, setTab] = useState<"appointments" | "blocked">("appointments");
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const { data: appointments, isLoading, refetch } = useListAppointments();
  const { slots: blockedSlots, loading: loadingSlots, reload: reloadSlots } = useBlockedSlots();

  // Block form state
  const [blockDate, setBlockDate] = useState<Date | undefined>(undefined);
  const [blockTime, setBlockTime] = useState<string>("all");
  const [blockReason, setBlockReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const localAuth = sessionStorage.getItem("josafa_owner");
    if (localAuth === "1") { setReady(true); return; }
    fetch("/api/auth/me", { credentials: "include", headers: { "Cache-Control": "no-cache" } })
      .then((r) => r.json())
      .then((d: { isOwner: boolean }) => {
        if (d.isOwner) { sessionStorage.setItem("josafa_owner", "1"); setReady(true); }
        else { window.location.href = "/proprietario"; }
      })
      .catch(() => { window.location.href = "/proprietario"; });
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem("josafa_owner");
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/proprietario";
  };

  const handleStatusChange = async (id: number, status: AppointmentStatus) => {
    setUpdatingId(id);
    await updateStatus(id, status);
    await refetch();
    setUpdatingId(null);
  };

  const handleAddBlock = async () => {
    if (!blockDate) return;
    setSaving(true);
    await fetch("/api/blocked-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        date: format(blockDate, "dd/MM/yyyy"),
        time: blockTime === "all" ? null : blockTime,
        reason: blockReason || null,
      }),
    });
    setBlockDate(undefined);
    setBlockTime("all");
    setBlockReason("");
    setSaving(false);
    reloadSlots();
  };

  const handleDeleteBlock = async (id: number) => {
    await fetch(`/api/blocked-slots/${id}`, { method: "DELETE", credentials: "include" });
    reloadSlots();
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Verificando acesso...</p>
      </div>
    );
  }

  const filtered = (appointments ?? []).filter((a) => filter === "all" || a.status === filter);
  const counts = {
    all: (appointments ?? []).length,
    pending: (appointments ?? []).filter((a) => a.status === "pending").length,
    confirmed: (appointments ?? []).filter((a) => a.status === "confirmed").length,
    completed: (appointments ?? []).filter((a) => a.status === "completed").length,
    cancelled: (appointments ?? []).filter((a) => a.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary" style={{ fontFamily: "'Cinzel', serif" }}>Josafá</span>
            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Área do Proprietário</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-muted-foreground">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-none text-sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          <button
            onClick={() => setTab("appointments")}
            className={cn(
              "px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === "appointments"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            )}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Agendamentos
          </button>
          <button
            onClick={() => setTab("blocked")}
            className={cn(
              "px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
              tab === "blocked"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            )}
          >
            <Ban className="w-4 h-4 inline mr-2" />
            Dias/Horários Bloqueados
            {blockedSlots.length > 0 && (
              <span className="ml-2 text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">
                {blockedSlots.length}
              </span>
            )}
          </button>
        </div>

        {/* Appointments Tab */}
        {tab === "appointments" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {(["pending", "confirmed", "completed", "cancelled"] as AppointmentStatus[]).map((s) => (
                <div
                  key={s}
                  className="border border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setFilter(s)}
                >
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
              <div className="space-y-3">
                {filtered.map((appt) => {
                  const status = appt.status as AppointmentStatus;
                  return (
                    <div key={appt.id} className="border border-border rounded-lg p-5 hover:border-primary/30 transition-colors bg-card">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-primary text-sm">{appt.name}</h3>
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
                        <div className="flex flex-col gap-2 shrink-0">
                          <a href={formatWhatsAppUrl(appt.phone, appt.name, appt.serviceName ?? "", appt.preferredDate, appt.preferredTime)} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="outline" className="rounded-none text-xs h-8 w-full border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800">
                              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                              WhatsApp
                            </Button>
                          </a>
                          {status !== "completed" && status !== "cancelled" && (
                            <>
                              {status === "pending" && (
                                <Button size="sm" onClick={() => handleStatusChange(appt.id, "confirmed")} disabled={updatingId === appt.id} className="rounded-none text-xs h-8 bg-primary text-primary-foreground">
                                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />Confirmar
                                </Button>
                              )}
                              {status === "confirmed" && (
                                <Button size="sm" variant="outline" onClick={() => handleStatusChange(appt.id, "completed")} disabled={updatingId === appt.id} className="rounded-none text-xs h-8">
                                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />Concluir
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => handleStatusChange(appt.id, "cancelled")} disabled={updatingId === appt.id} className="rounded-none text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                <XCircle className="w-3.5 h-3.5 mr-1.5" />Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Blocked Slots Tab */}
        {tab === "blocked" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-primary mb-1">Bloquear Dia ou Horário</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Bloqueie um dia inteiro (ex: feriado, folga) ou um horário específico. Clientes não conseguirão agendar nos períodos bloqueados.
              </p>

              <div className="border border-border rounded-lg p-5 bg-card space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Date picker */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">Data</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("rounded-none text-sm font-normal justify-start", !blockDate && "text-muted-foreground")}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {blockDate ? format(blockDate, "dd/MM/yyyy") : "Escolha uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker
                          mode="single"
                          selected={blockDate}
                          onSelect={setBlockDate}
                          disabled={(d) => { const t = new Date(); t.setHours(0,0,0,0); return d < t; }}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time picker */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">Horário</label>
                    <Select value={blockTime} onValueChange={setBlockTime}>
                      <SelectTrigger className="rounded-none text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Dia inteiro</SelectItem>
                        {timeSlots.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reason */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground">Motivo (opcional)</label>
                    <Input
                      placeholder="Ex: Feriado, Férias..."
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      className="rounded-none text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddBlock}
                  disabled={!blockDate || saving}
                  className="rounded-none bg-primary text-primary-foreground text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Adicionar Bloqueio"}
                </Button>
              </div>
            </div>

            {/* List of blocks */}
            <div>
              <h3 className="text-sm font-semibold text-primary mb-3">Bloqueios Ativos</h3>
              {loadingSlots ? (
                <div className="text-sm text-muted-foreground py-8 text-center">Carregando...</div>
              ) : blockedSlots.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-lg">
                  Nenhum bloqueio cadastrado
                </div>
              ) : (
                <div className="space-y-2">
                  {blockedSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between gap-4 border border-border rounded-lg px-4 py-3 bg-card">
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                          <Calendar className="w-3.5 h-3.5" />
                          {slot.date}
                        </span>
                        {slot.time ? (
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {slot.time}
                          </span>
                        ) : (
                          <Badge variant="destructive" className="text-xs">Dia inteiro</Badge>
                        )}
                        {slot.reason && (
                          <span className="text-xs text-muted-foreground italic">{slot.reason}</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBlock(slot.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none h-8 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react";
import { useCreateAppointment, useListServices } from "@workspace/api-client-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  phone: z.string().min(10, { message: "Telefone inválido." }),
  email: z.string().email({ message: "E-mail inválido." }),
  serviceId: z.coerce.number().min(1, { message: "Selecione um serviço." }),
  preferredDate: z.date({
    required_error: "Selecione uma data.",
  }),
  preferredTime: z.string().min(1, { message: "Selecione um horário." }),
  notes: z.string().optional(),
});

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

function isSunday(date: Date) {
  return date.getDay() === 0;
}

function isPast(date: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function BookingSection() {
  const { data: services, isLoading: isLoadingServices } = useListServices();
  const createAppointment = useCreateAppointment();
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceId: 0,
      preferredTime: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setBookingError("");
    createAppointment.mutate({
      data: {
        name: values.name,
        phone: values.phone,
        email: values.email,
        serviceId: values.serviceId,
        preferredDate: format(values.preferredDate, "dd/MM/yyyy"),
        preferredTime: values.preferredTime,
        notes: values.notes,
      }
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
      },
      onError: (err: unknown) => {
        const msg = (err as { data?: { error?: string } })?.data?.error;
        if (msg) {
          setBookingError(msg);
        } else {
          setBookingError("Erro ao enviar agendamento. Tente novamente.");
        }
      },
    });
  }

  return (
    <section id="agendamento" className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-primary font-semibold mb-4">Agende a Sua Avaliação</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Dê o primeiro passo para resgatar sua autoestima. Preencha o formulário abaixo e nossa equipe entrará em contato para confirmar seu horário.
          </p>
        </div>

        <div className="bg-card p-6 md:p-10 rounded-xl shadow-xl border border-card-border">
          {isSuccess ? (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-primary font-semibold mb-3">Agendamento Solicitado!</h3>
              <p className="text-muted-foreground mb-8">
                Recebemos suas informações. Em breve, nossa equipe entrará em contato para confirmar os detalhes e garantir que sua experiência seja perfeita.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Fazer novo agendamento
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} className="bg-background" data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone / WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 90000-0000" {...field} className="bg-background" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com" {...field} className="bg-background" data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serviço Desejado</FormLabel>
                      <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value ? String(field.value) : undefined}>
                        <FormControl>
                          <SelectTrigger className="bg-background" data-testid="select-service">
                            <SelectValue placeholder={isLoadingServices ? "Carregando serviços..." : "Selecione um serviço"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {services?.map((service) => (
                            <SelectItem key={service.id} value={String(service.id)}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="mb-2">Data de Preferência</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                data-testid="button-date-picker"
                                className={cn(
                                  "w-full pl-3 text-left font-normal bg-background",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                  <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                form.setValue("preferredTime", "");
                              }}
                              disabled={(date) => isPast(date) || isSunday(date)}
                              initialFocus
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                        <p className="text-xs text-muted-foreground mt-1">Atendemos de segunda a sábado</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Horário de Preferência</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background" data-testid="select-time">
                              <SelectValue placeholder="Selecione um horário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações Adicionais (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte-nos um pouco sobre o que você busca ou se tem alguma dúvida específica..."
                          className="resize-none bg-background min-h-[100px]"
                          data-testid="textarea-notes"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {bookingError && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive text-center" data-testid="text-booking-error">
                    {bookingError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                  disabled={createAppointment.isPending}
                  data-testid="button-submit-booking"
                >
                  {createAppointment.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Solicitar Agendamento"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}

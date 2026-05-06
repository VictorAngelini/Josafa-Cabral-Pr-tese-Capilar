import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export function OwnerLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setLocation("/proprietario/agendamentos");
      } else {
        const data = await res.json() as { error: string };
        setError(data.error ?? "Senha incorreta");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary">Área do Proprietário</h1>
          <p className="text-muted-foreground mt-2 text-sm">Josafá - Hair & Prótese Capilar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-owner-login">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Senha de acesso</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="rounded-none h-11"
              data-testid="input-owner-password"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center" data-testid="text-login-error">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-login-submit"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
}

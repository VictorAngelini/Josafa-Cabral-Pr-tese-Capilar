import { Router } from "express";

const router = Router();

router.post("/auth/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const ownerPassword = process.env.OWNER_PASSWORD;

  if (!ownerPassword) {
    req.log.error("OWNER_PASSWORD env var is not set");
    return res.status(500).json({ error: "Configuração de autenticação ausente" });
  }

  if (!password || password !== ownerPassword) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  (req.session as Record<string, unknown>).isOwner = true;
  req.session.save((err) => {
    if (err) {
      req.log.error({ err }, "Failed to save session");
      return res.status(500).json({ error: "Erro ao criar sessão" });
    }
    res.json({ ok: true });
  });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/auth/me", (req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  const isOwner = !!(req.session as Record<string, unknown>).isOwner;
  res.json({ isOwner });
});

export default router;

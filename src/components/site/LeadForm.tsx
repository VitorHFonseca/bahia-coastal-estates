import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120, "Nome muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255),
  telefone: z.string().trim().max(40).optional(),
  mensagem: z.string().trim().max(1000, "Mensagem muito longa").optional(),
});

export function LeadForm({
  propertyId,
  consultorId,
  compact = false,
  titulo = "Tenho interesse",
  mensagemInicial = "",
}: {
  propertyId?: string;
  consultorId?: string | null;
  compact?: boolean;
  titulo?: string;
  mensagemInicial?: string;
}) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: mensagemInicial,
  });
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Verifique os dados");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("leads").insert({
      nome: parsed.data.nome,
      email: parsed.data.email,
      telefone: parsed.data.telefone || null,
      mensagem: parsed.data.mensagem || null,
      property_id: propertyId ?? null,
      consultor_id: consultorId ?? null,
    });
    setSaving(false);
    if (error) {
      toast.error("Não foi possível enviar. Tente novamente.");
      return;
    }
    toast.success("Recebemos seu contato! Um consultor responderá em breve.");
    setForm({ nome: "", email: "", telefone: "", mensagem: mensagemInicial });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!compact && <h3 className="font-display text-2xl">{titulo}</h3>}
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-2">
          <Label htmlFor="lead-nome">Nome</Label>
          <Input
            id="lead-nome"
            value={form.nome}
            maxLength={120}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Seu nome"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-email">E-mail</Label>
          <Input
            id="lead-email"
            type="email"
            value={form.email}
            maxLength={255}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="voce@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-telefone">Telefone / WhatsApp</Label>
          <Input
            id="lead-telefone"
            value={form.telefone}
            maxLength={40}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            placeholder="(00) 00000-0000"
          />
        </div>
        <div className={cnSpan(compact)}>
          <Label htmlFor="lead-mensagem">Mensagem</Label>
          <Textarea
            id="lead-mensagem"
            value={form.mensagem}
            maxLength={1000}
            rows={4}
            onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
            placeholder="Conte o que você procura no litoral da Bahia"
          />
        </div>
      </div>
      <Button type="submit" size="lg" disabled={saving} className="w-full sm:w-auto">
        {saving ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}

function cnSpan(compact: boolean) {
  return compact ? "space-y-2" : "space-y-2 sm:col-span-2";
}

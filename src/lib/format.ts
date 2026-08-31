export function formatBRL(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor ?? 0);
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(area ?? 0)} m²`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(iso));
}

export const TIPOS = [
  { value: "casa", label: "Casa" },
  { value: "apartamento", label: "Apartamento" },
  { value: "terreno", label: "Terreno" },
  { value: "pousada", label: "Pousada" },
  { value: "fazenda", label: "Fazenda" },
] as const;

export const CARACTERISTICAS = [
  "Frente-mar",
  "Vista mar",
  "Vista mata",
  "Piscina",
  "Mobiliado",
  "Churrasqueira",
  "Ar-condicionado",
  "Portaria 24h",
  "Coqueiral",
  "Documentação regular",
] as const;

export const STATUS_LABEL: Record<string, string> = {
  disponivel: "Disponível",
  negociacao: "Em negociação",
  vendido: "Vendido",
  alugado: "Alugado",
};

export const LEAD_STATUS: { value: string; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "visita", label: "Visita agendada" },
  { value: "proposta", label: "Proposta" },
  { value: "fechado", label: "Fechado" },
];

export function tipoLabel(tipo: string): string {
  return TIPOS.find((t) => t.value === tipo)?.label ?? tipo;
}

export const WHATSAPP = "5573999990000";

export function whatsappLink(mensagem: string, numero = WHATSAPP): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];

export const destaquesQuery = queryOptions({
  queryKey: ["properties", "destaques"],
  queryFn: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("publicado", true)
      .eq("aprovado", true)
      .eq("destaque", true)
      .order("created_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    return data ?? [];
  },
});

export const catalogoQuery = queryOptions({
  queryKey: ["properties", "catalogo"],
  queryFn: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("publicado", true)
      .eq("aprovado", true)
      .order("destaque", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export function imovelQuery(id: string) {
  return queryOptions({
    queryKey: ["properties", "detalhe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function consultorQuery(id: string | null) {
  return queryOptions({
    queryKey: ["profiles", id],
    queryFn: async (): Promise<Profile | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: true,
  });
}

export function meusImoveisQuery(userId: string) {
  return queryOptions({
    queryKey: ["properties", "meus", userId],
    queryFn: async (): Promise<Property[]> => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("consultor_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export const todosImoveisQuery = queryOptions({
  queryKey: ["properties", "todos"],
  queryFn: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export const consultoresQuery = queryOptions({
  queryKey: ["profiles", "todos"],
  queryFn: async (): Promise<Profile[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});

export function leadsQuery(userId: string, isAdmin: boolean) {
  return queryOptions({
    queryKey: ["leads", isAdmin ? "todos" : userId],
    queryFn: async (): Promise<Lead[]> => {
      const query = supabase.from("leads").select("*").order("created_at", { ascending: false });
      const { data, error } = isAdmin ? await query : await query.eq("consultor_id", userId);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function meuPerfilQuery(userId: string) {
  return queryOptions({
    queryKey: ["profiles", "meu", userId],
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

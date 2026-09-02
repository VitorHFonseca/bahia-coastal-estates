import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const BUCKET = "imoveis";

function isDirect(path: string) {
  return path.startsWith("http") || path.startsWith("/");
}

/**
 * Resolve imagens do imóvel: caminhos do storage privado ganham URL assinada,
 * URLs públicas e arquivos locais passam direto.
 */
export function useImagens(paths: string[] | undefined): string[] {
  const key = (paths ?? []).join("|");
  const [urls, setUrls] = useState<string[]>(() => (paths ?? []).filter(isDirect));

  useEffect(() => {
    const list = key ? key.split("|") : [];
    if (list.length === 0) {
      setUrls([]);
      return;
    }
    if (list.every(isDirect)) {
      setUrls(list);
      return;
    }
    let active = true;
    (async () => {
      const resolved = await Promise.all(
        list.map(async (path) => {
          if (isDirect(path)) return path;
          const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
          return data?.signedUrl ?? "";
        }),
      );
      if (active) setUrls(resolved.filter(Boolean));
    })();
    return () => {
      active = false;
    };
  }, [key]);

  return urls;
}

export async function uploadImagem(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

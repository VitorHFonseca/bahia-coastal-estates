CREATE TYPE public.app_role AS ENUM ('admin', 'consultor');
CREATE TYPE public.property_status AS ENUM ('disponivel', 'negociacao', 'vendido', 'alugado');
CREATE TYPE public.lead_status AS ENUM ('novo', 'contatado', 'visita', 'proposta', 'fechado');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nome TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefone TEXT,
  whatsapp TEXT,
  bio TEXT,
  foto_url TEXT,
  cidade TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  preco NUMERIC NOT NULL DEFAULT 0,
  cidade TEXT NOT NULL,
  bairro TEXT,
  tipo TEXT NOT NULL DEFAULT 'casa',
  quartos INTEGER NOT NULL DEFAULT 0,
  banheiros INTEGER NOT NULL DEFAULT 0,
  area NUMERIC NOT NULL DEFAULT 0,
  caracteristicas TEXT[] NOT NULL DEFAULT '{}',
  imagens TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  status public.property_status NOT NULL DEFAULT 'disponivel',
  publicado BOOLEAN NOT NULL DEFAULT false,
  aprovado BOOLEAN NOT NULL DEFAULT true,
  destaque BOOLEAN NOT NULL DEFAULT false,
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT SELECT ON public.properties TO anon;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  consultor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  status public.lead_status NOT NULL DEFAULT 'novo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis ativos visiveis publicamente" ON public.profiles FOR SELECT USING (ativo = true OR auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Usuario cria seu proprio perfil" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuario edita seu proprio perfil" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin remove perfis" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuario ve seus papeis" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Imoveis publicados visiveis" ON public.properties FOR SELECT USING ((publicado = true AND aprovado = true) OR auth.uid() = consultor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Consultor cria imovel" ON public.properties FOR INSERT TO authenticated WITH CHECK (auth.uid() = consultor_id);
CREATE POLICY "Consultor edita seu imovel" ON public.properties FOR UPDATE TO authenticated USING (auth.uid() = consultor_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = consultor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Consultor remove seu imovel" ON public.properties FOR DELETE TO authenticated USING (auth.uid() = consultor_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Qualquer um envia lead" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Consultor ve seus leads" ON public.leads FOR SELECT TO authenticated USING (auth.uid() = consultor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Consultor atualiza seus leads" ON public.leads FOR UPDATE TO authenticated USING (auth.uid() = consultor_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = consultor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin remove leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.raw_user_meta_data ->> 'full_name', ''), COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'consultor')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER properties_touch BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.increment_property_views(_id UUID)
RETURNS VOID LANGUAGE SQL SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.properties SET visualizacoes = visualizacoes + 1 WHERE id = _id;
$$;
GRANT EXECUTE ON FUNCTION public.increment_property_views(UUID) TO anon, authenticated;

INSERT INTO public.properties (titulo, descricao, preco, cidade, bairro, tipo, quartos, banheiros, area, caracteristicas, imagens, status, publicado, destaque, visualizacoes) VALUES
('Casa frente-mar em Trancoso', 'Casa de arquitetura rústica-chique a poucos metros da areia, com varanda de madeira, piscina de borda infinita e vista integral para o mar. Acabamentos em madeira de demolição e palha nativa.', 4850000, 'Trancoso', 'Praia dos Coqueiros', 'casa', 4, 5, 420, ARRAY['Frente-mar','Piscina','Mobiliado','Vista mar','Ar-condicionado'], ARRAY['/images/imovel-1.jpg','/images/imovel-2.jpg','/images/imovel-3.jpg'], 'disponivel', true, true, 412),
('Vila contemporânea em Itacaré', 'Vila de três suítes cercada por mata atlântica, a 400m da Praia da Concha. Piscina natural, cozinha gourmet aberta e deck suspenso entre as árvores.', 2380000, 'Itacaré', 'Praia da Concha', 'casa', 3, 4, 260, ARRAY['Piscina','Vista mata','Mobiliado','Churrasqueira'], ARRAY['/images/imovel-2.jpg','/images/imovel-4.jpg'], 'disponivel', true, true, 287),
('Pousada boutique em Morro de São Paulo', 'Pousada em operação com 9 suítes, restaurante, piscina e vista para a Segunda Praia. Excelente histórico de ocupação e equipe treinada.', 6200000, 'Morro de São Paulo', 'Segunda Praia', 'pousada', 9, 10, 780, ARRAY['Frente-mar','Piscina','Mobiliado','Negócio em operação'], ARRAY['/images/imovel-3.jpg','/images/imovel-1.jpg'], 'disponivel', true, true, 533),
('Apartamento pé na areia em Praia do Forte', 'Apartamento reformado em condomínio arborizado, com acesso direto à praia, varanda ampla e área de lazer completa.', 1290000, 'Praia do Forte', 'Centro', 'apartamento', 2, 2, 96, ARRAY['Vista mar','Mobiliado','Portaria 24h','Piscina'], ARRAY['/images/imovel-4.jpg','/images/imovel-2.jpg'], 'disponivel', true, false, 176),
('Terreno com vista para o mar em Caraíva', 'Terreno de 1.200m² em área nobre, topografia levemente elevada com vista desimpedida para o mar e para o Rio Caraíva.', 890000, 'Caraíva', 'Alto de Caraíva', 'terreno', 0, 0, 1200, ARRAY['Vista mar','Documentação regular'], ARRAY['/images/imovel-5.jpg'], 'disponivel', true, false, 98),
('Fazenda litorânea em Maraú', 'Fazenda de 18 hectares com coqueiral produtivo, casa sede em madeira e acesso privativo a lagoa de água doce.', 3950000, 'Península de Maraú', 'Barra Grande', 'fazenda', 5, 3, 180000, ARRAY['Coqueiral','Lagoa','Casa sede','Vista mata'], ARRAY['/images/imovel-5.jpg','/images/imovel-3.jpg'], 'disponivel', true, true, 241);
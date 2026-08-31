CREATE POLICY "Autenticado envia fotos de imoveis" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'imoveis');
CREATE POLICY "Autenticado le fotos de imoveis" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'imoveis');
CREATE POLICY "Autenticado atualiza fotos de imoveis" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'imoveis');
CREATE POLICY "Autenticado remove fotos de imoveis" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'imoveis');
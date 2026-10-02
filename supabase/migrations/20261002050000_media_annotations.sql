-- =====================================================================
-- Señalamientos (flechas y recuadros) dibujados sobre cada imagen desde el panel.
-- Se guardan como datos aparte: la imagen original no se modifica.
-- Correr una sola vez, después de 20261002040000_media_gallery.sql.
-- =====================================================================

alter table public.slide_media add column annotations jsonb;

INSERT INTO public.user_roles (user_id, role)
VALUES ('7699c6a5-27b4-44ab-9374-10cccd1a30f2', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

INSERT INTO public.departments (name) VALUES 
  ('Engineering'),
  ('Sales'),
  ('Marketing'),
  ('Operations'),
  ('Product'),
  ('HR'),
  ('Finance'),
  ('Legal'),
  ('Design'),
  ('Data'),
  ('Support'),
  ('Security')
ON CONFLICT (name) DO NOTHING;

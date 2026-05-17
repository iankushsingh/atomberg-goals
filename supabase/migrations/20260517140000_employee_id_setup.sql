-- Create sequence for employee IDs
CREATE SEQUENCE IF NOT EXISTS employee_id_seq START 1000;

-- Function to set employee_id automatically
CREATE OR REPLACE FUNCTION public.set_employee_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.employee_id IS NULL THEN
    NEW.employee_id := 'EMP-' || nextval('employee_id_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before insert on profiles
DROP TRIGGER IF EXISTS tr_set_employee_id ON public.profiles;
CREATE TRIGGER tr_set_employee_id
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_employee_id();

-- Backfill existing profiles without employee_id
UPDATE public.profiles 
SET employee_id = 'EMP-' || nextval('employee_id_seq') 
WHERE employee_id IS NULL;

-- Ensure RLS allows Admins to update profiles
DO $$
BEGIN
  DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
  
  CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
  );
END $$;


CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER 
SECURITY definer
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ 
LANGUAGE plpgsql;

-- trigger for updating the timestamp for a profile
CREATE OR REPLACE TRIGGER trg_notification_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- trigger for updating the timestamp for a profile
CREATE OR REPLACE TRIGGER trg_profile_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
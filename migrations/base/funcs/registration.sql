-- Description: Functions and triggers related to the registration process


-- A function used to trigger the creation of a new profile whenever a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SET search_path = ''
LANGUAGE plpgsql 
SECURITY definer
AS $$
BEGIN
  -- Check if the username is provided
  IF new.raw_user_meta_data->>'username' IS NULL OR new.raw_user_meta_data->>'username' = '' THEN
    RAISE EXCEPTION 'Username must be provided for new users';
  END IF;

  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  
  RETURN new;
END;
$$;

-- A trigger automatically invoked whenever a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT 
  ON auth.users
  FOR each ROW EXECUTE PROCEDURE public.handle_new_user();

-- Drop the restrictive policy that prevents admins from allocating cameras to users
DROP POLICY IF EXISTS "Users can manage their own allocation" ON camera_allocations;

-- Create a new policy that allows authenticated users (admins) to manage all allocations
CREATE POLICY "Authenticated users can manage all allocations"
ON camera_allocations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Keep the existing view policy for unauthenticated users
-- (Already exists: "Anyone can view camera allocations")
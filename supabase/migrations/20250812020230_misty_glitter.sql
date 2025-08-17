/*
  # Update gifts table to store purchaser contact info

  1. Changes
    - Modify purchased_by column to store name and phone
    - Keep existing data structure
  
  2. Security
    - Maintain existing RLS policies
*/

-- The purchased_by column will now store "Name - Phone" format
-- No schema changes needed, just updating the application logic
// src/utils/supabaseHelpers.js

// CRITICAL: You MUST have the 'export' keyword here
export const getImageUrl = (path) => {
  if (!path) return 'https://placehold.jp/24/1c2a32/ffffff/150x150.png?text=LostInCyprus';

  // Make sure these match your Supabase Dashboard exactly
  const projectID = 'bwxqxgjwpsurptaduwii'; 
  const bucketName = 'articles'; 

  return `https://${projectID}.supabase.co/storage/v1/object/public/${bucketName}/${path}`;
};
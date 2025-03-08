import { supabase } from '../lib/supabase';

/**
 * Add content to its corresponding collection
 * @param {string} contentId - The ID of the content
 * @param {string} platformName - The name of the platform
 * @param {boolean} isRevived - Whether the content is from revival
 */
export async function addToCollection(contentId, platformName, isRevived = false) {
  try {
    // Handle Twitter posts and threads both going to Twitter collection
    const collectionName = platformName.startsWith('Twitter') ? 'Twitter' : platformName;

    // Get collection ID
    const { data: collection, error: collectionError } = await supabase
      .from('content_collections')
      .select('id')
      .eq('name', collectionName)
      .single();

    if (collectionError || !collection) {
      throw new Error(`Collection not found: ${collectionName}`);
    }

    // Add to collection
    const { error: insertError } = await supabase
      .from('collection_items')
      .insert({
        collection_id: collection.id,
        content_id: contentId,
        is_revived: isRevived,
        content_type: isRevived ? 'revived' : 'regular'
      });

    if (insertError) {
      if (insertError.code === '23505') {
        // Duplicate entry - content already in collection
        return;
      }
      throw insertError;
    }
  } catch (error) {
    console.error('Error adding to collection:', error);
    throw error;
  }
}
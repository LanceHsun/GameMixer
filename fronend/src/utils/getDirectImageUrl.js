/**
 * Converts Google Drive sharing URLs to embeddable image URLs
 * @param {string} url - The Google Drive sharing URL
 * @returns {string|null} - Embeddable image URL or null if invalid
 */
const getDirectImageUrl = (url) => {
  if (!url) return null;

  try {
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com')) {
      let fileId;
      
      // Extract file ID from various Google Drive URL formats
      if (url.includes('/file/d/')) {
        fileId = url.split('/file/d/')[1].split('/')[0];
      } else if (url.includes('id=')) {
        fileId = url.match(/id=([^&]+)/)[1];
      }

      if (!fileId) {
        console.warn('Could not extract file ID from Google Drive URL:', url);
        return null;
      }

      // Use the thumbnail URL format which is more reliable for embedding
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    }

    // If it's not a Google Drive URL, return as is
    return url;
  } catch (error) {
    console.error('Error converting URL:', error);
    return null;
  }
};

export default getDirectImageUrl;
/**
 * Converts Google Drive sharing URLs to embeddable image URLs and handles fallback images
 * @param {string} url - The Google Drive sharing URL or any image URL
 * @param {string} [fallbackUrl='/images/default-event-image.jpg'] - The fallback image URL to use if conversion fails
 * @returns {string} - Embeddable image URL or fallback URL
 */
const getDirectImageUrl = (url, fallbackUrl = '/images/default-event-image.jpg') => {
    if (!url) return fallbackUrl;
  
    try {
      // Check if it's a Google Drive URL
      if (url.includes('drive.google.com')) {
        let fileId;
        
        // Extract file ID from various Google Drive URL formats
        if (url.includes('/file/d/')) {
          fileId = url.split('/file/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
          const match = url.match(/id=([^&]+)/);
          if (!match) {
            console.warn('Could not extract file ID from Google Drive URL:', url);
            return fallbackUrl;
          }
          fileId = match[1];
        }
  
        if (!fileId) {
          console.warn('Could not extract file ID from Google Drive URL:', url);
          return fallbackUrl;
        }
  
        // Use the thumbnail URL format which is more reliable for embedding
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }
  
      // If it's a relative URL, make sure it starts with a slash
      if (url.startsWith('./')) {
        url = url.substring(1);
      }
      
      // If it's not a Google Drive URL, return as is
      return url;
    } catch (error) {
      console.warn('Error converting URL:', error, 'Using fallback image.');
      return fallbackUrl;
    }
  };
  
  export default getDirectImageUrl;
async function uploadToCloudflareImages(buffer, metadata = {}, accountId, apiToken) {
    const formData = new FormData();
    formData.append('file', new Blob([buffer]));
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
  
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        body: formData
      }
    );
  
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.errors[0].message);
    }
  
    return {
      id: result.result.id,
      url: result.result.variants[0]
    };
}
  
async function uploadToCloudflareStream(buffer, metadata = {}, accountId, apiToken) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        body: buffer
      }
    );
  
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.errors[0].message);
    }
  
    return {
      id: result.result.uid,
      url: `https://watch.cloudflarestream.com/${result.result.uid}`
    };
}
  
async function deleteCloudflareImage(imageId, accountId, apiToken) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      }
    );
  
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.errors[0].message);
    }
}
  
async function deleteCloudflareVideo(videoId, accountId, apiToken) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      }
    );
  
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.errors[0].message);
    }
}
  
export {
    uploadToCloudflareImages,
    uploadToCloudflareStream,
    deleteCloudflareImage,
    deleteCloudflareVideo
};
/**
 * Fetches an image from the given URL and returns it as a blob.
 *
 * @param {string} url - The URL of the image to fetch.
 * @returns {Promise<Blob>} A Promise that resolves to the image data as a Blob.
 * @throws {Error} Will throw an error if the fetch operation fails or returns a non-OK response.
 * @throws {TypeError} Will throw if the URL is malformed or uses an unsupported protocol.
 * @throws {DOMException} May throw a DOMException for CORS issues or other security-related errors.
 */
export const fetchImage = (url: string): Promise<Blob> => {
  console.log('fetchImage', url)
  // Encode the URL to handle special characters properly
  const encodedUrl = encodeURI(url)
  return fetch(encodedUrl)
    .then((response) => {
      console.log('response', response)
      if (!response.ok) {
        console.error('response not ok', response)
        return Promise.reject(new Error(`Failed to fetch image: ${response.status} ${response.statusText}`))
      }
      return response.blob()
    })
    .catch((error: DOMException | TypeError) => {
      console.error('Error fetching image:', error.message)
      throw error
    })
}


/**
 * Converts a data URL (e.g., data:image/jpeg;base64,...) to a Promise that resolves to a Blob.
 *
 * @param {string} dataUrl - The data URL to convert.
 * @returns {Promise<Blob>} - A Promise that resolves to the resulting Blob object.
 */
export const toBlob = (dataUrl: string): Promise<Blob> => {
  // Split the data URL into the metadata and the base64-encoded data
  const [metadata, base64Data] = dataUrl.split(',');

  // Extract the MIME type from the metadata
  const mimeType = metadata.match(/:(.*?);/)?.[1] || '';

  // Decode the base64 string into a byte array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);

  // Create and return a Blob from the byte array
  return Promise.resolve(new Blob([byteArray], { type: mimeType }));
};



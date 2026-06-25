export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024

export function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Image could not be read'))
    }

    reader.onerror = () => reject(new Error('Image could not be read'))
    reader.readAsDataURL(file)
  })
}

export function validateImageFile(file) {
  if (!file) {
    return ''
  }

  if (!file.type.startsWith('image/')) {
    return 'Please upload a valid image file.'
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Please use an image smaller than 2MB so it can be saved on your device.'
  }

  return ''
}

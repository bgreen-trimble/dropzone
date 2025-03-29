export type TransferItem = {
  type: string
  data: string | FileList | Blob
}

export const isImageMimeType = (type: string) => {
  return type.match(/^image\/(jpeg|jpg|gif|png|webp)$/)
}

export type TransferBlob = {
  type: string
  data: Promise<string>
}


export type TransferImage = {
  type: string
  data: string
}

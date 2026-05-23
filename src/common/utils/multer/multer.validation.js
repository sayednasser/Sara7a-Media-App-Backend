export const fileFilter = (validation = []) => {
  return (req, file, cb) => {
    const allowedTypes = validation.map(v => v.toLowerCase())
      if (!allowedTypes.includes(file.mimetype.toLowerCase())) {
      return cb(new Error(`Invalid file type ${file.mimetype}`), { cause: { status: 400 } }, false)

    }
    return cb(null, true)

  }
}

export const filedValidation = {
  image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  video: ['video/mp4', 'video/mp3', 'video/mkv', 'video/avi'],
  audio: ['audio/wav', 'audio/mpeg', 'audio/ogg'],
  file: ['application/pdf']
}
import multer from "multer";

export const uploadMedia = ({
  fieldName = "files",
  maxCount = 10,
  fileSize,
  mimeTypes,
}) =>
  multer({
    storage: multer.memoryStorage(),
    limits: fileSize ? { fileSize } : undefined,
    fileFilter: (req, file, cb) => {
      if (mimeTypes && !mimeTypes.includes(file.mimetype)) {
        cb(new Error("Invalid file type"), false);
      } else {
        cb(null, true);
      }
    },
  }).array(fieldName, maxCount);
  export const uploadSingleMedia = ({
  fieldName = "file",
  fileSize,
  mimeTypes,
}) =>
  multer({
    storage: multer.memoryStorage(),
    limits: fileSize ? { fileSize } : undefined,
    fileFilter: (req, file, cb) => {
      if (mimeTypes && !mimeTypes.includes(file.mimetype)) {
        cb(new Error("Invalid file type"), false);
      } else {
        cb(null, true);
      }
    },
  }).single(fieldName);


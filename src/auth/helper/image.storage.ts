import { v4 as uuidv4 } from 'uuid';
import path = require('path');

// const fs = require('fs');
// const fileType = require('file-type');
import fs from 'fs';
import FileType from 'file-type';
import { diskStorage } from 'multer';

type validFileExtension = 'png' | 'jgp' | 'jpeg';
type validMimeType = 'image/png' | 'image/jgp' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jgp', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jgp',
  'image/jpeg',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      // const fileExtension: string = path.extname();
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowMimeTypes: validMimeType[] = validMimeTypes;
    allowMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

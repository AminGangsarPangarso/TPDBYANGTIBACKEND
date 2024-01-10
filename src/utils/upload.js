import multer from "multer"
import { BadRequestError } from "./apiError"
import path from "path"
import fs from "fs"

const imageWhitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]

const baseImagePublicDir = path.join('public', 'images')

const uploadImage = multer({
    limits: {
        fileSize: 10 * Math.pow(1024, 2)
    },
    storage: multer.diskStorage({
        destination: baseImagePublicDir,
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
            const fileName = uniqueSuffix + path.extname(file.originalname);
            cb(null, fileName);
            req.on('aborted', () => {
                const fullPathImage = path.join(baseImagePublicDir, fileName);
                file.stream.on('end', () => {
                    removeImageFullPath(fullPathImage)
                });
                file.stream.emit('end');
            })
        },
    }),
    fileFilter: (req, file, cb) => {
        if (!imageWhitelist.includes(file.mimetype)) {
            return cb(new BadRequestError('image is not allowed'))
        }
        cb(null, true)
    }
})

const removeImageFullPath = (fullPathImage) => {
    fs.unlink(fullPathImage, (err) => {
        if (err) {
            throw err;
        }
    });
}

const removeImage = (fileName) => {
    const fullPath = path.join(baseImagePublicDir, fileName);
    removeImageFullPath(fullPath)
}

export default uploadImage
export {
    imageWhitelist,
    baseImagePublicDir as basePublicDir,
    uploadImage,
    removeImageFullPath,
    removeImage,
}
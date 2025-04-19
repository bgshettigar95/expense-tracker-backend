const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

//File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (allowedTypes.includes(file.type)) {
        cb(null, true);
    } else {
        cb(new Error('Only .jpeg, .png, .jpg formats are allowed'), false)
    }
}

const upload = multer({ storage, fileFilter });

module.exports = upload;
import db from '../../../db';
import Image from '../../../db/models/schema/image';
import multer from 'multer';

/* we are to save the uploaded images to a local folder */
const upload = multer({ dest: '../../../images' });

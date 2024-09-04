import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'user_profiles', // Puedes especificar una carpeta en Cloudinary
        },
        (error, result) => {
          if (error) {
            // Manejo de errores de Cloudinary con más contexto
            reject(
              new HttpException(
                'Failed to upload image to Cloudinary',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          } else {
            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}

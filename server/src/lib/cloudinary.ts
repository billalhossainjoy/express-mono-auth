import { type UploadApiResponse, v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../config/env/cloudinary.env";
import streamifier from "streamifier";

export class Uploader {
  cloudinary = cloudinary;

  constructor() {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  static async upload(
    location: string,
    file: Buffer<ArrayBufferLike>,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "tahakhadar/" + location.replace(/^\//g, ""),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );

      streamifier.createReadStream(file).pipe(stream);
    });
  }

  static async destroy(publicId: string) {
    try {
      return cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

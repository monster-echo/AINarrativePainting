import COS from "cos-nodejs-sdk-v5"

import { resize } from "./improxy"
import { COS_SecretId, COS_SecretKey, COS_Region, COS_Bucket } from "@/config"

const cos = new COS({
  SecretId: COS_SecretId,
  SecretKey: COS_SecretKey,
})
class Storage {
  private constructor(private bucket: string) {}

  static from(bucket: string) {
    return new Storage(COS_Bucket)
  }

  public exists = async (fileKey: string) => {
    return new Promise((resolve, reject) => {
      cos.headObject(
        {
          Bucket: this.bucket,
          Region: COS_Region,
          Key: fileKey,
        },
        (err, data) => {
          if (err) {
            if (err.statusCode === 404) {
              return resolve(false)
            }
            console.error("Error checking object existence:", err)
            return reject(err)
          }
          return resolve(true)
        }
      )
    })
  }

  public upload = async (fileKey: string, file: Blob) => {
    return new Promise<{ data: any; error: any }>(async (resolve, reject) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      cos.putObject(
        {
          Bucket: this.bucket,
          Region: COS_Region,
          Key: fileKey,
          Body: buffer,
        },
        (err, data) => {
          if (err) {
            console.error("Error uploading object:", err)
            return reject(err)
          }
          return resolve({ data, error: null })
        }
      )
    })
  }

  public createSignedUrl = async (
    fileKey: string,
    expire: number,
    { transform }: { transform?: { width: number; height?: number } } = {}
  ) => {
    return new Promise<{ data: { signedUrl: string }; error: any }>(
      (resolve, reject) => {
        cos.getObjectUrl(
          {
            Bucket: this.bucket,
            Region: COS_Region,
            Key: fileKey,
            Sign: true,
            Expires: expire,
          },
          (err, data) => {
            if (err) {
              console.error("Error getting object url:", err)
              return reject(err)
            }
            const signedUrl = resize(data.Url, {
              transform: transform,
            })
            return resolve({ data: { signedUrl }, error: null })
          }
        )
      }
    )
  }
}

export default Storage

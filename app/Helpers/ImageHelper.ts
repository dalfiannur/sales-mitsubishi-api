import path from "path";
import fs from 'fs'

export default class ImageHelper {
    public static async delete(file: string) {
        const uploadPath = path.resolve(__dirname, '../../upload')

        if (fs.existsSync(uploadPath + '/' + file)) {
            fs.unlinkSync(uploadPath + '/' + file)
        }
    }
}
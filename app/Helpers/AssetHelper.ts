import { appUrl, isDevelopment } from "Config/app"

export class AssetHelper {
  public static getUrl(path: string) {
    if (isDevelopment) {
      return 'http://' + appUrl + '/' + path
    }
    return 'https://' + appUrl + '/' + path
  }
}

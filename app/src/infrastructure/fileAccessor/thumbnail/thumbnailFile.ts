import appRoot from "app-root-path";
import glob from "glob";
import path from "path";
import fs from "fs";

import {v4 as uuidv4} from "uuid";
import conversionImgSize from "../../smartcrop/smartcrop";

export default class ThumbnailFileAccessor {
  private readonly filePath = `${appRoot.path}/public/thumbnail/`;
  private readonly defaultThumbnailReg = "default-thumbnail-[0-9]*";

  public fetchNames(fileType: "default" | "custom" | null = null): string[] {
    const templatePath = `${this.filePath}/*`;
    const files = glob.sync(templatePath);

    const res: string[] = files.map((file) => path.basename(file, ".png"));
    const defaultImgList = res.filter((fileName) => new RegExp(this.defaultThumbnailReg, "g").test(fileName));
    const customImgList = res.filter((fileName) => !new RegExp(this.defaultThumbnailReg, "g").test(fileName));
    if (fileType === "default") return defaultImgList;
    else if (fileType === "custom") return customImgList;

    return defaultImgList.concat(customImgList);
  }

  public async save(multerFileName: string): Promise<string> {
    const multerPath = `${this.filePath}${multerFileName}`;

    const newFileName = uuidv4();

    await conversionImgSize(multerPath, `${this.filePath}${newFileName}.png`);

    fs.unlinkSync(multerPath);

    return newFileName;
  }

  public delete(fileName: string): void {
    if (new RegExp(this.defaultThumbnailReg, "g").test(fileName)) {
      throw new Error("Default images cannot be deleted.");
    }

    const filePath = `${this.filePath}${fileName}.png`;

    const file = glob.sync(filePath);

    if (file.length !== 1) {
      throw new Error("Incorrect file name.");
    }

    const thumbnailList = this.fetchNames("custom");

    if (!thumbnailList.includes(fileName)) throw new Error("Using images cannnot be deleted.");

    fs.unlinkSync(file[0]);
  }
}

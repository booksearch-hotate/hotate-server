import sharp from "sharp";
import smartcrop from "smartcrop-sharp";
import fs from "fs";

export default async function conversionImgSize(input: string, output: string, width=1280, height=720) {
  const body = fs.readFileSync(input);
  const result = await smartcrop.crop(body, {width: width, height: height});
  const crop = result.topCrop;
  return await sharp(body)
      .extract({width: crop.width, height: crop.height, left: crop.x, top: crop.y})
      .resize(width, height)
      .toFile(output);
};

export default function isSameLenAllArray(arrays: any[]) {
  const standardNum = arrays[0].length;

  for (const item of arrays) {
    if (standardNum !== item.length) return false;
  }

  return true;
}

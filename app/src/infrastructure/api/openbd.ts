import axios from 'axios';

const url = 'http://api.openbd.jp/v1/get?isbn=';

export async function getImgLink(isbn: string | null): Promise<string | null> {
  if (isbn === null) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await axios.get(`${url}${isbn}`).then((res) => res.data) as any;
    return res[0].onix.CollateralDetail.SupportingResource[0].ResourceVersion[0].ResourceLink as string;
  } catch (e) {
    return null;
  }
}

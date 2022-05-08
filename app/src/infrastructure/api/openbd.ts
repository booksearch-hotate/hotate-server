import axios from 'axios'

const url = 'http://api.openbd.jp/v1/get?isbn='

export async function getImgLink (isbn: string): Promise<string> {
  const res = await axios.get(`${url}${isbn}`) as any
  return res[0].SupportingResource[0].ResourceVersion.ResourceLink as string
}

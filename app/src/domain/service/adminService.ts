import Admin from '../model/admin/adminModel';

export default class AdminService {
  public isValid(to: Admin, from: Admin): boolean {
    // Object.equalsがないのでその代用
    // https://www.deep-rain.com/programming/javascript/755#ObjectentriesJSONstringify

    const toEntries = JSON.stringify(Object.entries(to).sort());
    const fromEntries = JSON.stringify(Object.entries(from).sort());

    return toEntries === fromEntries;
  }
}

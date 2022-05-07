import AdminModel from "../model/adminModel"

export default class AdminService {
  public isValid (to: AdminModel, from: AdminModel): boolean {
    // Object.equalsがないのでその代用
    // https://www.deep-rain.com/programming/javascript/755#ObjectentriesJSONstringify
    return JSON.stringify(Object.entries(to).sort()) === JSON.stringify(Object.entries(from).sort())
  }
}

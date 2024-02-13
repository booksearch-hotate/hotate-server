import BookRequestData from "../bookRequestData";

export default class RequestSaveInputData {
  public requestData: BookRequestData;

  public constructor(requestData: BookRequestData) {
    this.requestData = requestData;
  }
}

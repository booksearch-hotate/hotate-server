import {v4 as uuidv4} from 'uuid';

export default class RecommendationService {
  public createUUID(): string {
    return uuidv4();
  }
}

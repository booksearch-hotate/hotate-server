import bcyrpt from 'bcrypt';

export default class crypt {
  static encrypt(password: string): string {
    return bcyrpt.hashSync(password, 10);
  }

  static compare(password: string, hash: string): boolean {
    return bcyrpt.compareSync(password, hash);
  }
}

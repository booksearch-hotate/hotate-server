export interface Usecase<I, O> {
  execute(input: I): O;
}

export default interface Mapper<I, O> {
  mapToOutput(input: I): O;
}

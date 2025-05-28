/* eslint-disable @typescript-eslint/array-type */
export default function joinClasses(
  ...args: Array<string | boolean | null | undefined>
) {
  return args.filter(Boolean).join(" ");
}

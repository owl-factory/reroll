import { isID } from "../../../server/utilities/resolverHelpers";

// isID
describe("isID", () => {
  test("isID valid id", () => {
    expect(isID("111111111111111111111111")).toBe(true);
  });

  test("isID invalid id", () => {
    expect(isID("")).toBe(false);
    expect(isID("1111111111111111111111112")).toBe(false);
    expect(isID("11111111111111111111112")).toBe(false);
  });
});


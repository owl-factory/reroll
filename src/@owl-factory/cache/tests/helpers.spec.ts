import { argsToString, buildCacheItem } from "../helpers";


describe("argsToString", () => {
  test("string", () => {
    const str = "test";
    const res = argsToString(str);
    expect(res).toBe(str);
  });

  test("array", () => {
    const args = [ "thing", { object: "this" } ];
    const res = argsToString(args);
    expect(res).toBe(JSON.stringify(args));
  });
});

describe("buildCacheItems", () => {
  test("success", () => {
    const now = Date.now();
    const name = "test_name";
    const args = "test_args";
    const value = {};
    const options = { ttl: 0 };
    const cacheItem = buildCacheItem(name, args, value, options);

    expect(cacheItem.value).toStrictEqual(value);
    expect(cacheItem.ttl).toStrictEqual(options.ttl);
    expect(cacheItem.updatedAt).toBe(now);
    expect(cacheItem.deleteAt).toStrictEqual(now + (options.ttl * 60 * 1000));
    expect(cacheItem.prune).toBeDefined();
  });
});

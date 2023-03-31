import { slugify } from "./utils.js";

describe("slugify())", () => {
  it("should return a given lowercase ascii string unchanged", () => {
    expect(slugify("hello")).toBe("hello");
  });
  it("should return a string with no spaces", () => {
    const slugLength = slugify("hello world").length;
    const comparisonSlugLength = slugify("hello world").replace(" ", "").length;
    expect(slugLength).toBe(comparisonSlugLength);
  });
  it("should return a string which is all lowercase", () => {
    expect(slugify("HElloWorld")).toBe("helloworld");
  });
  it("should return a purely alphanumeci string", () => {
    const re = /(\d|\w)+/i;
    expect(re.test(slugify("0309r^897r87(&ejfkdsa)"))).toBe(true);
  });
});

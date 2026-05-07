import { describe, expect, it } from "vitest";
import { getScoreBand, getScoreTone } from "./scoreBands";

describe("FARO score bands", () => {
  it("maps score 56 to Operator-Hostile", () => {
    expect(getScoreBand(56)).toEqual({
      min: 50,
      max: 69,
      label: "Operator-Hostile"
    });
  });

  it("keeps the public FARO bands stable", () => {
    expect(getScoreBand(20).label).toBe("Invisible to Operators");
    expect(getScoreBand(40).label).toBe("Not Operable");
    expect(getScoreBand(76).label).toBe("Operator-Compatible With Gaps");
    expect(getScoreBand(88).label).toBe("FARO Ready");
    expect(getScoreBand(96).label).toBe("FARO Certified");
  });

  it("uses the orange tone for Operator-Hostile scores", () => {
    expect(getScoreTone(56).name).toBe("orange");
  });
});

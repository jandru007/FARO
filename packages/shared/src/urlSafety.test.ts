import { describe, expect, it } from "vitest";
import {
  getNormalizedDomain,
  isPrivateIp,
  normalizeUrl,
  resolveAndValidateHostname,
  validatePublicUrl
} from "./urlSafety";

describe("URL safety", () => {
  it("normalizes bare domains to HTTPS and strips fragments", () => {
    expect(normalizeUrl("example.com/path#team")).toBe("https://example.com/path");
  });

  it("returns a lowercase normalized domain without www", () => {
    expect(getNormalizedDomain("https://www.Example.com/products")).toBe("example.com");
  });

  it("blocks private IPv4 and IPv6 ranges", () => {
    expect(isPrivateIp("10.0.0.1")).toBe(true);
    expect(isPrivateIp("172.20.10.5")).toBe(true);
    expect(isPrivateIp("192.168.1.10")).toBe(true);
    expect(isPrivateIp("127.0.0.1")).toBe(true);
    expect(isPrivateIp("0.0.0.0")).toBe(true);
    expect(isPrivateIp("fc00::1")).toBe(true);
    expect(isPrivateIp("fe80::1")).toBe(true);
    expect(isPrivateIp("93.184.216.34")).toBe(false);
  });

  it("rejects localhost and private hostnames before DNS resolution", async () => {
    await expect(validatePublicUrl("http://localhost:3000")).rejects.toThrow("public websites");
    await expect(validatePublicUrl("https://printer.local")).rejects.toThrow("public websites");
    await expect(validatePublicUrl("https://intranet.internal")).rejects.toThrow("public websites");
  });

  it("rejects hostnames that resolve to private IPs", async () => {
    await expect(
      resolveAndValidateHostname("safe-looking.example", async () => ["10.0.0.7"])
    ).rejects.toThrow("public websites");
  });
});

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type HostnameResolver = (hostname: string) => Promise<string[]>;

const PRIVATE_HOST_SUFFIXES = [".local", ".internal"];
const PRIVATE_HOSTNAMES = new Set(["localhost", "localhost.localdomain", "0.0.0.0"]);

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error("Enter a valid public website URL.");
  }

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Enter a valid public website URL.");
  }

  url.hash = "";
  url.username = "";
  url.password = "";
  return url.toString();
}

export function getNormalizedDomain(urlInput: string): string {
  const url = new URL(normalizeUrl(urlInput));
  return normalizeHostname(url.hostname).replace(/^www\./, "");
}

export async function validatePublicUrl(
  urlInput: string,
  resolver?: HostnameResolver
): Promise<string> {
  const normalized = normalizeUrl(urlInput);
  const url = new URL(normalized);
  const hostname = normalizeHostname(url.hostname);

  assertPublicHostname(hostname);

  if (isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error("For safety, FARO can only scan public websites.");
    }
    return normalized;
  }

  await resolveAndValidateHostname(hostname, resolver);
  return normalized;
}

export async function resolveAndValidateHostname(
  hostnameInput: string,
  resolver?: HostnameResolver
): Promise<string[]> {
  const hostname = normalizeHostname(hostnameInput);
  assertPublicHostname(hostname);

  const addresses = resolver
    ? await resolver(hostname)
    : (await lookup(hostname, { all: true, verbatim: true })).map((entry) => entry.address);

  if (addresses.length === 0) {
    throw new Error("We could not resolve this public website.");
  }

  const privateAddress = addresses.find((address) => isPrivateIp(address));
  if (privateAddress) {
    throw new Error("For safety, FARO can only scan public websites.");
  }

  return addresses;
}

export function isPrivateIp(input: string): boolean {
  const ip = input.trim().toLowerCase().replace(/^\[/, "").replace(/\]$/, "");

  if (ip.startsWith("::ffff:")) {
    return isPrivateIp(ip.slice("::ffff:".length));
  }

  if (isIP(ip) === 4) {
    const parts = ip.split(".").map((part) => Number(part));
    const [a, b] = parts;

    if (a === undefined || b === undefined || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
      return true;
    }

    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  if (isIP(ip) === 6) {
    return (
      ip === "::1" ||
      ip === "::" ||
      ip.startsWith("fc") ||
      ip.startsWith("fd") ||
      ip.startsWith("fe80") ||
      ip.startsWith("fe90") ||
      ip.startsWith("fea0") ||
      ip.startsWith("feb0")
    );
  }

  return true;
}

function normalizeHostname(hostname: string): string {
  return hostname.trim().toLowerCase().replace(/\.$/, "");
}

function assertPublicHostname(hostname: string): void {
  if (!hostname || PRIVATE_HOSTNAMES.has(hostname) || PRIVATE_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    throw new Error("For safety, FARO can only scan public websites.");
  }

  if (!isIP(hostname) && !hostname.includes(".")) {
    throw new Error("For safety, FARO can only scan public websites.");
  }
}

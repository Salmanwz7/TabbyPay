import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the whole site is prerendered to out/ and runs from a
  // local folder. The 15 Oct final cannot depend on venue wifi or Vercel.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // evidence/ has its own lockfile; pin the root so Next does not guess.
  outputFileTracingRoot: process.cwd(),

  // Operational rule carried over from submission 2: never run `next build`
  // while `next dev` is up. They share `.next`, and the dev server then serves
  // stale chunks. Typecheck and tests are safe at any time.
};

export default nextConfig;

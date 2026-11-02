import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Build a plain static site into `out/` so Netlify (or any static host) can serve it.
  output: 'export',
  // Stop `next dev` writing AGENTS.md when an AI agent runs it; this project's AI notes live outside the repo.
  agentRules: false,
};

export default nextConfig;

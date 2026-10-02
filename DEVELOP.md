# Developing `@abcp/agent-sdk`

## What this repo is

**Generated code only.** The typed messages + `AgentService`/`AdminService`
descriptors under `src/gen/` are produced by `buf` from `agent/v1/agent.proto`.
The source of truth is `abcp-sdk/agent-proto`; this repo is a distribution
target. **Do not edit `src/gen/` by hand** — regenerate instead.

## Build & check

```bash
npm install          # installs @bufbuild/protobuf, @connectrpc/connect, typescript
npm run build        # tsc -p tsconfig.json  -> dist/
npm run check        # tsc --noEmit (type-check only)
```

There is no test suite. `npm run check` (type-check) and a successful
`npm run build` are the verification steps before publishing.

## Regenerate

```bash
(cd ../agent-proto && ./scripts/sync-agent-sdks.sh --only ts)
npm run build
```

## Publishing & consuming via artifact (not GitHub/npmjs)
- Consume: .npmrc → registry=http://artifact.worker.svc.cluster.local/artifacts/npm/
- Publish: scoped name + npm publish --access public (_authToken in .npmrc)
See easy-vcs/deploy:PUBLISHING.md.

## Notes / non-obvious decisions

- npm requires a **scoped** name (`@abcp/agent-sdk`); unscoped publishes are
  rejected by artifact. `publishConfig.access` is already `public`.
- artifact serves plain **HTTP** in-cluster, so npm clients need
  `strict-ssl=false` (see `PUBLISHING.md` → Notes).
- Read/install from artifact is **anonymous**; only `npm publish` needs the
  `_authToken` in `.npmrc`. Never commit a real token.
- Prefer artifact over the `github:abcp-sdk/...` git-dependency pattern: npm
  fetches that from github.com, which can lag the cluster Forgejo tags. If you
  must use a git dependency, point it at the cluster Forgejo
  (`git+http://git.agent.svc.cluster.local/<org>/<repo>.git#<tag>`) and
  regenerate `package-lock.json`.

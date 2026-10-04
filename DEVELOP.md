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

### How to publish from a bare sandbox (verified recipe)

The sandbox images have **no Node/npm**; get them from artifact's generic store
(the same catalog the on-demand toolchains use — no egress needed):

```bash
A=http://artifact.worker.svc.cluster.local
curl -sS -o /tmp/node.tar.xz \
  "$A/artifacts/generic/toolchains-node/26.9.0/node-v26.9.0-linux-x64.tar.xz"
mkdir -p /opt/node && tar -xJf /tmp/node.tar.xz -C /opt/node --strip-components=1
export PATH=/opt/node/bin:$PATH        # node v26.9.0

cat > ~/.npmrc <<'EOF'
registry=http://artifact.worker.svc.cluster.local/artifacts/npm/
strict-ssl=false
//artifact.worker.svc.cluster.local/artifacts/npm/:_authToken=dev-artifact-token
EOF

cd <checkout-of-the-tag-to-publish>
npm install                # pulls @bufbuild/protobuf/@connectrpc/connect from artifact
npm run build              # dist/ (tsc)
npm publish --access public
```

- The write token is the chart's `secrets.artifactToken` (dev default
  `dev-artifact-token`; see `easy-vcs/deploy` CREDENTIALS.md). Only the cluster
  session has it — **tag ≠ published**: creating a Forgejo tag does NOT push to
  artifact; each version must be `npm publish`ed explicitly.
- **Publish in ascending order.** Publishing a version LOWER than the current
  `latest` fails unless you pass `--tag <non-latest>` (e.g. to backfill 0.29.0
  after 0.30.0: `npm publish --access public --tag legacy`; exact-version install
  `npm install @abcp/agent-sdk@0.29.0` still works).
- Verify: `curl -s $A/artifacts/npm/@abcp/agent-sdk` → `dist-tags` + `versions`.

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

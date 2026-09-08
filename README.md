# abcp-sdk agent-sdk-typescript

TypeScript SDK for the abc agent (`agent.v1.AgentService`). The typed RPC
client is generated from `abcp-sdk/agent-proto`; this package adds the
transport factory + auth + ergonomic wrappers.

## Transport

The agent serves HTTP/2 only. Client transports:

- `createAgentClient({ baseUrl, token })` — cleartext HTTP/2 (h2c prior
  knowledge) for `http://`, ALPN h2 for `https://` (via `@connectrpc/connect-node`).
- JSON/binary Connect codec, typed messages from protobuf.

## Usage

```ts
import { createAgentClient } from '@abcp/agent-sdk'
const agent = createAgentClient({ baseUrl: 'http://abcp-agent:80', token: 'devtoken' })
const r = await agent.health({})
```

## Publishing

This is a pnpm/npm package consumed as a git dependency
(`abcp-sdk/agent-sdk-typescript#vX.Y.Z`).

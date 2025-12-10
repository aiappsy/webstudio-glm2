# AI Copy History (server)

This patch ships an **in-memory** history inside the API route:
`src/app/api/projects/[projectId]/ai/copy/route.ts`

## Why
- Keep **per-block** history of copy proposals (before/after + meta).
- Enable **revert** or audit later.

## Production
Move to Prisma models:
```prisma
model AiHistory {
  id        String   @id @default(cuid())
  projectId String
  blockId   String
  field     String
  before    String
  after     String
  meta      Json
  createdAt DateTime @default(now())
  @@index([projectId, blockId, field])
}
```

Then replace the in-memory map with DB writes/reads.
-- Rename sessionToken column to sessionTokenHash
ALTER TABLE "user_sessions" RENAME COLUMN "sessionToken" TO "sessionTokenHash";

-- Drop the old unique index
DROP INDEX "user_sessions_sessionToken_key";

-- Create new unique index for sessionTokenHash
CREATE UNIQUE INDEX "user_sessions_sessionTokenHash_key" ON "user_sessions"("sessionTokenHash");

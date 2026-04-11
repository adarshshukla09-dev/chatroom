import {
  pgTable,
  integer,
  text,
  timestamp,
  boolean,
  index,pgEnum,
  uuid,
  PgTable,
} from "drizzle-orm/pg-core";

export const room = pgTable("room",{
  id: uuid("id").primaryKey(),
  name:text("name").notNull(),
message:text("message")
})

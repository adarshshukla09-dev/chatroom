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
import { user } from "./auth-schema";



export const messages = pgTable("messages",{
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: text("sender_id").notNull().references(() => user.id),
  receiverId: text("receiver_id").notNull().references(() => user.id),
  content: text("content").notNull(),
  seen:boolean().default(false),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
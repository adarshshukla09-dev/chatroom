"use server";

import { messages, user } from "@/db/schema";
import { db } from "@/db";
import { ne, or,eq, and } from "drizzle-orm";

export const getAllUserForLeftSideBar = async (curruserId: string) => {
  try {
    const allUser = await db
      .select()
      .from(user)
      .where(ne(user.id, curruserId));

    const usersWithUnseenCount = await Promise.all(
      allUser.map(async (singleUser) => {
        const unseenMessage = await db
          .select()
          .from(messages)
          .where(
            and(
              eq(messages.seen, false),
              eq(messages.senderId, singleUser.id),
              eq(messages.receiverId, curruserId)
            )
          );

        return {
          ...singleUser,
          unseenMessageCount: unseenMessage.length,
        };
      })
    );

    return usersWithUnseenCount
  } catch (error) {
    console.log(error);
  }
};
export const getUser = async (userId: string) => {
  try {
    const sender = await db.select().from(user).where(eq(user.id, userId));
    return sender;
  } catch (error) {
    console.log(error);
  }
};
export const getChatMessages = async (
  curruserId: string,
  otherUserId: string,
) => {
  try {
    const Allmessages = await db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.senderId, curruserId),
            eq(messages.receiverId, otherUserId),
          ),
          and(
            eq(messages.senderId, otherUserId),
            eq(messages.receiverId, curruserId),
          ),
        ),
      );
    return Allmessages;
  } catch (error) {
    console.log(error);
  }
};

export const markSeen = async (curruserId: string, otherUserId: string) => {
  try {
    await db
      .update(messages)
      .set({ seen: true })
      .where(
        and(
          eq(messages.senderId, curruserId),
          eq(messages.receiverId, otherUserId),
        ),
      );
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = async (
  curruserId: string,
  otherUserId: string,
  content: string,
) => {
  try {
    await db.insert(messages).values({
      senderId: curruserId,
      receiverId: otherUserId,
      content,
      seen: false,
    });
  } catch (error) {
    console.log(error);
  }
};

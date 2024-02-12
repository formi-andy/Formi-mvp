"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { type Chat } from "@/lib/types";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";

export async function getChats() {
  const token = await getAuthToken();

  const chats = await fetchQuery(api.chat.getChats, {}, { token });

  if (!chats) {
    return [];
  }

  const parsedChats = chats.map((chat) => {
    return {
      id: chat._id as string,
      title: chat.title as string,
      createdAt: new Date(chat._creationTime),
      userId: chat.user_id as string,
      path: `/chat/${chat._id}`,
      messages: [],
    } as Chat;
  });

  return parsedChats;
}

export async function getChat(id: string) {
  const token = await getAuthToken();

  const chat = await fetchQuery(
    api.chat.getChat,
    {
      id: id as Id<"chat">,
    },
    { token }
  );

  if (!chat) {
    return null;
  }

  return chat;
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  // delete chat from the user's chats
  const token = await getAuthToken();

  await fetchMutation(
    api.chat.removeChat,
    {
      id: id as Id<"chat">,
    },
    { token }
  );

  // TODO: refetch all chats

  revalidatePath("/chat");
  return redirect(path);
}

// export async function clearChats() {
//   const session = await auth();

//   if (!session?.user?.id) {
//     return {
//       error: "Unauthorized",
//     };
//   }

//   const chats: string[] = await kv.zrange(
//     `user:chat:${session.user.id}`,
//     0,
//     -1
//   );
//   if (!chats.length) {
//     return redirect("/");
//   }
//   const pipeline = kv.pipeline();

//   for (const chat of chats) {
//     pipeline.del(chat);
//     pipeline.zrem(`user:chat:${session.user.id}`, chat);
//   }

//   await pipeline.exec();

//   revalidatePath("/");
//   return redirect("/");
// }

// export async function getSharedChat(id: string) {
//   const chat = await kv.hgetall<Chat>(`chat:${id}`);

//   if (!chat || !chat.sharePath) {
//     return null;
//   }

//   return chat;
// }

// export async function shareChat(id: string) {
//   const session = await auth();

//   if (!session?.user?.id) {
//     return {
//       error: "Unauthorized",
//     };
//   }

//   const chat = await kv.hgetall<Chat>(`chat:${id}`);

//   if (!chat || chat.userId !== session.user.id) {
//     return {
//       error: "Something went wrong",
//     };
//   }

//   const payload = {
//     ...chat,
//     sharePath: `/share/${chat.id}`,
//   };

//   await kv.hmset(`chat:${chat.id}`, payload);

//   return payload;
// }

"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { LuLayoutGrid } from "react-icons/lu";

import { api } from "@/convex/_generated/api";
import ActionItemLoader from "./ActionItemLoader";

type ActionItems = (typeof api.action_item.getActionItems)["_returnType"];

function renderActionItems(actionItems: ActionItems) {
  if (actionItems.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="p-4 border rounded-lg">
          <LuLayoutGrid size={32} />
        </div>
        <p className="text-base font-medium mt-8">No action items found</p>
        <p className="text-sm text-center mt-1">
          Action items are created by your doctor and are used to help you
          manage your health.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {actionItems.map((item) => (
          <Link
            href={`/action-item/${item._id}`}
            key={item._id}
            className="flex flex-col border rounded-lg p-4 hover:bg-neutral-50 transition"
          >
            <p className="font-medium">{item.title}</p>
            <div className="text-sm">
              Created by{" "}
              <Link
                href={`/user/${item.created_by._id}`}
                className="font-medium text-blue-500 hover:underline"
              >
                {`${item.created_by.firstName} ${item.created_by.lastName}`}
              </Link>
            </div>
            <p className="text-sm mt-2 line-clamp-2">{item.description}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export default function ActionItems() {
  const actionItems = useQuery(api.action_item.getActionItems, {});

  return (
    <div className="flex flex-col border rounded-lg min-h-[200px] p-4 lg:p-8 gap-4">
      <p className="text-2xl font-medium">Action Items</p>
      {actionItems === undefined ? (
        <ActionItemLoader />
      ) : (
        renderActionItems(actionItems)
      )}
    </div>
  );
}

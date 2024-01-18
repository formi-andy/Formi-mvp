"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import Link from "next/link";

import { SessionStatus } from "@/types/practice-session-types";
import { formatTime } from "@/utils/formatTime";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";

import style from "./doctorgallery.module.css";
import { Skeleton } from "antd";
import { useState } from "react";

export default function PastSessions() {
  const pastSessions = useQuery(api.practice_session.getSessions);
  const [activePage, setPage] = useState(1);
  const { results, status, loadMore } = usePaginatedQuery(
    api.practice_session.getPaginatedSessions,
    {
      paginationOpts: {
        numItems: 10,
      },
    },
    { initialNumItems: 50 }
  );

  const totalPages = Math.ceil(results.length / 10);
  const currentSessions = results.slice((activePage - 1) * 10, activePage * 10);

  return (
    <div
      className={`flex flex-col rounded-lg min-h-[200px] p-3 sm:p-6 gap-3 relative ${style.glass}`}
    >
      <p className="text-2xl font-medium text-white">Past Sessions</p>
      <div className="border border-white rounded-lg flex flex-col">
        {status === "LoadingFirstPage" || status === "LoadingMore"
          ? Array.from(Array(3).keys()).map((i) => (
              <div
                key={i}
                className="w-full grid gap-3 p-3 border-b first:rounded-t-lg last:rounded-b-lg last:border-0 h-[107px]"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="w-52 h-6">
                      <Skeleton.Button className="!w-full !h-full" active />
                    </div>
                    <div className="w-24 h-5">
                      <Skeleton.Button className="!w-full !h-full" active />
                    </div>
                  </div>
                  <div className="flex mt-1 flex-wrap items-center justify-between">
                    <div className="w-36 h-5">
                      <Skeleton.Button className="!w-full !h-full" active />
                    </div>
                    <div className="w-36 h-5">
                      <Skeleton.Button className="!w-full !h-full" active />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="w-full h-6">
                    <Skeleton.Button className="!w-full !h-full" active />
                  </div>
                </div>
              </div>
            ))
          : currentSessions.map((session) => (
              <Link
                href={`/practice/${session._id}`}
                key={session._id}
                className="grid gap-3 p-3 border-b first:rounded-t-lg last:rounded-b-lg last:border-0 hover:bg-blue-500 transition"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between">
                    <p className="text-white text-lg font-medium">
                      {session.name ? session.name : "Practice Session"}
                    </p>
                    <p className="text-white font-medium">
                      {session.status === SessionStatus.Completed
                        ? `${
                            Math.round(
                              (session.total_correct /
                                session.questions.length +
                                Number.EPSILON) *
                                100
                            ) / 100
                          }% (${session.total_correct}/${
                            session.questions.length
                          })`
                        : "In Progress"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between">
                    <p className="text-white text-sm font-medium">
                      {dayjs(session._creationTime).format("M/DD/YYYY h:mm A")}
                    </p>
                    <p className="text-white text-sm font-medium">
                      Time elapsed: {formatTime(session.total_time)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {session.tags.length === 0 ? (
                    <Badge variant="secondary">All</Badge>
                  ) : (
                    session.tags.map((tag) => (
                      <Badge key={tag} variant="default">
                        {tag}
                      </Badge>
                    ))
                  )}
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

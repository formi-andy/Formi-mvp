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

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PER_PAGE = 10;

function renderPaginationButtons(
  activePage: number,
  totalPages: number,
  setPage: (page: number) => void
) {
  if (totalPages <= 5) {
    return Array.from(Array(totalPages).keys()).map((page) => (
      <PaginationButton
        key={page}
        onClick={() => setPage(page + 1)}
        isActive={page + 1 === activePage}
      >
        {page + 1}
      </PaginationButton>
    ));
  }

  if (activePage === 1) {
    return (
      <>
        {Array.from(Array(3).keys()).map((page) => (
          <PaginationButton
            key={page}
            onClick={() => setPage(page + 1)}
            isActive={page + 1 === activePage}
          >
            {page + 1}
          </PaginationButton>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationButton onClick={() => setPage(totalPages)}>
          {totalPages}
        </PaginationButton>
      </>
    );
  } else if (activePage >= totalPages) {
    return (
      <>
        <PaginationButton onClick={() => setPage(1)}>1</PaginationButton>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        {Array.from(Array(3).keys())
          .reverse()
          .map((page) => (
            <PaginationButton
              key={page}
              onClick={() => setPage(totalPages - page)}
              isActive={totalPages - page === activePage}
            >
              {totalPages - page}
            </PaginationButton>
          ))}
      </>
    );
  } else {
    return (
      <>
        {activePage - 1 > 1 && (
          <>
            <PaginationButton onClick={() => setPage(1)}>1</PaginationButton>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        <PaginationButton onClick={() => setPage(activePage - 1)}>
          {activePage - 1}
        </PaginationButton>
        <PaginationButton isActive>{activePage}</PaginationButton>
        <PaginationButton onClick={() => setPage(activePage + 1)}>
          {activePage + 1}
        </PaginationButton>
        {activePage + 1 < totalPages && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationButton onClick={() => setPage(totalPages)}>
              {totalPages}
            </PaginationButton>
          </>
        )}
      </>
    );
  }
}

export default function PastSessions() {
  const [activePage, setPage] = useState(1);
  const { results, status, loadMore } = usePaginatedQuery(
    api.practice_session.getPaginatedSessions,
    {
      paginationOpts: {
        numItems: PER_PAGE,
      },
    },
    { initialNumItems: 50 }
  );

  const totalPages = Math.ceil(results.length / PER_PAGE);
  const currentSessions = results.slice(
    (activePage - 1) * PER_PAGE,
    activePage * PER_PAGE
  );

  return (
    <div
      className={`flex flex-col rounded-lg min-h-[200px] p-3 sm:p-6 gap-3 relative ${style.glass}`}
    >
      <p className="text-2xl font-medium text-white">Past Sessions</p>
      <div className="border border-white rounded-lg flex flex-col">
        {status === "LoadingFirstPage" || status === "LoadingMore" ? (
          Array.from(Array(3).keys()).map((i) => (
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
        ) : currentSessions.length === 0 ? (
          <div className="h-[534px] grid text-center items-center justify-center">
            <p className="text-white text-lg font-medium">
              {results.length === 0
                ? "No sessions created yet"
                : "You've reached the end"}
            </p>
          </div>
        ) : (
          currentSessions.map((session) => (
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
                            (session.total_correct / session.questions.length +
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
          ))
        )}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious
            disabled={activePage === 1}
            onClick={() => setPage(activePage - 1)}
          />
          {renderPaginationButtons(activePage, totalPages, setPage)}
          {status !== "Exhausted" && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationNext
            disabled={
              (activePage >= totalPages && status === "Exhausted") ||
              status === "LoadingMore" ||
              status === "LoadingFirstPage"
            }
            onClick={() => {
              if (status === "CanLoadMore" && activePage === totalPages) {
                loadMore(PER_PAGE);
              }
              setPage(activePage + 1);
            }}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
}

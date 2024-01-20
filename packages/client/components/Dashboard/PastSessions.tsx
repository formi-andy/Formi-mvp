"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import Link from "next/link";
import dayjs from "dayjs";

import { Skeleton } from "antd";
import { SessionStatus } from "@/types/practice-session-types";
import { formatTime } from "@/utils/formatTime";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import style from "./doctorgallery.module.css";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  renderPaginationBody,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TextInput } from "@mantine/core";

const PER_PAGE = 10;

export default function PastSessions() {
  const [activePage, setPage] = useState(1);
  const [name, setName] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const { results, status, loadMore } = usePaginatedQuery(
    api.practice_session.getPaginatedSessions,
    {
      name: name === "" ? undefined : name,
    },
    {
      initialNumItems: PER_PAGE * 5,
    }
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
      <div className="flex gap-1.5 px-6 rounded-lg">
        <TextInput
          placeholder="Search by name"
          value={nameFilter}
          onChange={(event) => setNameFilter(event.currentTarget.value)}
          classNames={{
            root: "w-full",
            input: "rounded-lg",
          }}
        />
        <Button
          variant="outline-action"
          className="border-none h-9"
          onClick={() => {
            setName(nameFilter.trim());
            setPage(1);
          }}
        >
          Search
        </Button>
      </div>
      <div className="border border-white rounded-lg flex flex-col transition">
        {status === "LoadingFirstPage" || status === "LoadingMore" ? (
          Array.from(Array(PER_PAGE).keys()).map((i) => (
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
          <div className="h-[400px] grid text-center items-center justify-center animate-fade-in">
            <p className="text-white text-xl sm:text-2xl font-light">
              {results.length === 0
                ? `No sessions ${name.length === 0 ? "created yet" : "found"}`
                : "You've reached the end"}
            </p>
          </div>
        ) : (
          currentSessions.map((session) => (
            <Link
              href={`/practice/${session._id}`}
              key={session._id}
              className="grid gap-3 p-3 border-b first:rounded-t-lg last:rounded-b-lg last:border-0 hover:bg-blue-500 transition animate-fade-in"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between">
                  <p className="text-white text-lg font-medium">
                    {session.name || "Practice Session"}
                  </p>
                  <p className="text-white font-medium">
                    {session.status === SessionStatus.Completed
                      ? `${Math.round(
                          (session.total_correct / session.questions.length +
                            Number.EPSILON) *
                            100
                        )}% (${session.total_correct}/${
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
          {renderPaginationBody(activePage, totalPages, setPage)}
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

"use client";

import { useState } from "react";
import { Skeleton } from "antd";
import NextImage from "next/image";

export default function Image({ url, alt }: { url: string; alt: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && (
        <Skeleton.Button active className="!w-full !h-full z-100 !min-w-0" />
      )}
      <NextImage
        onLoad={() => {
          setLoading(false);
        }}
        src={url}
        alt={alt}
        fill={true}
        style={{
          opacity: loading ? 0 : 1,
        }}
        className="rounded-lg object-cover"
      />
    </>
  );
}

export function CircleImage({ url, alt }: { url: string; alt: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {!loading && (
        <Skeleton.Avatar active className="max-w-full max-h-full z-100" />
      )}
      <NextImage
        onLoad={() => {
          setLoading(false);
        }}
        src={url}
        alt={alt}
        fill={true}
        style={{
          opacity: loading ? 0 : 1,
        }}
        className="rounded-full object-cover"
      />
    </>
  );
}

export function ContainImage({ url, alt }: { url: string; alt: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Skeleton.Button active className="!w-full !h-full z-100" />}
      <NextImage
        onLoad={() => {
          setLoading(false);
        }}
        src={url}
        alt={alt}
        fill={true}
        layout="fill"
        style={{
          opacity: loading ? 0 : 1,
        }}
        className="rounded-lg object-contain "
      />
    </>
  );
}

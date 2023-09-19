"use client";

import Gallery from "@/components/Gallery/Gallery";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const View = () => {
  let images = useQuery(api.images.listImages);

  return <Gallery images={images} />;
};

export default View;

import React from "react";
import { INITIAL_PARTS_INPUT } from "@/commons/constants/bodyParts";
import { Badge } from "../../../ui/badge";

function renderSelectedParts(
  parts: typeof INITIAL_PARTS_INPUT,
  setData: (parts: typeof INITIAL_PARTS_INPUT) => void
) {
  const selected: string[] = [];

  for (const key in parts) {
    if (parts[key].selected) {
      const split = key.split(/(?=[A-Z])/);
      selected.push(split.join(" "));
    }
  }

  if (selected.length === 0) {
    return <p>No area(s) selected</p>;
  }

  return (
    <div className="flex flex-wrap gap-2 capitalize">
      {selected.map((part, i) => {
        return (
          <Badge key={i} variant="default">
            {part}
          </Badge>
        );
      })}
      <Badge
        typeof="button"
        onClick={() => {
          const partsCopy = { ...parts };
          for (const key in partsCopy) {
            partsCopy[key].selected = false;
          }
          setData(partsCopy);
        }}
        variant="destructive"
      >
        Clear All
      </Badge>
    </div>
  );
}

export default function SelectedParts({
  bodyParts,
  setData,
}: {
  bodyParts: typeof INITIAL_PARTS_INPUT;
  setData: (parts: typeof INITIAL_PARTS_INPUT) => void;
}) {
  return (
    <div className="flex flex-col gap-y-2">
      <p className="font-medium text-lg">Selected Areas</p>
      {renderSelectedParts(bodyParts, setData)}
    </div>
  );
}

import React from "react";

export default function ReviewCardTag({ value }: { value: string }) {
  return <div className="bg-gray-10 w-43 px-2 py-4 text-center rounded-full">{value}</div>;
}

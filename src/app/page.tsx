"use client";

import dynamic from "next/dynamic";

const WordLensApp = dynamic(() => import("./WordLensApp"), {
  ssr: false,
  loading: () => (
    <div className="app-loading" role="status">
      Opening the WordLens archive…
    </div>
  ),
});

export default function Page() {
  return <WordLensApp />;
}

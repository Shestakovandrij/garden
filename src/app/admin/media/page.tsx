export const dynamic = "force-dynamic";

import { getMedia } from "@/engine/lib/actions/media";
import { MediaClient } from "@/engine/components/media-client";

export default async function MediaPage() {
  const media = await getMedia();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
      </div>
      <MediaClient initialMedia={JSON.parse(JSON.stringify(media))} />
    </div>
  );
}

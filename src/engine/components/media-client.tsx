"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  alt: string;
  mimeType: string;
  size: number;
  folder: string;
  createdAt: string;
}

export function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [media] = useState(initialMedia);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "general");

    await fetch("/api/admin/media", { method: "POST", body: fd });
    setUploading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      {/* Upload */}
      <div className="mb-6">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 h-10 px-5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {uploading ? "Uploading..." : "📎 Upload Image"}
        </button>
      </div>

      {/* Grid */}
      {media.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center text-gray-400">
          No media uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group relative">
              <div className="aspect-square bg-gray-100 relative">
                {item.mimeType.startsWith("image/") ? (
                  <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">📄</div>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-700 truncate">{item.filename}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

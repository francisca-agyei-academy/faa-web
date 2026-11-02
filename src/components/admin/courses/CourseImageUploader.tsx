"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { courseImageFor } from "@/content/courseImages";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { AdminCourse } from "@/types/admin";

const MAX_MB = 8;
const ACCEPT = "image/jpeg,image/png,image/webp,image/avif";

/** Upload or remove a course's own photo. Without one, the chosen built-in photo is used. */
export function CourseImageUploader({ course, onChange }: { course: AdminCourse; onChange: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function upload(file: File) {
    if (!ACCEPT.split(",").includes(file.type)) {
      toast.error("Upload a JPEG, PNG, WebP or AVIF image.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Images can be up to ${MAX_MB} MB.`);
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setBusy(true);
    const form = new FormData();
    form.append("image", file);
    const id = toast.loading("Uploading photo…");
    try {
      await api(`/admin/courses/${course.id}/image`, { method: "POST", body: form });
      toast.success("Photo updated. It appears on the website within a few minutes.", { id });
      onChange();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Upload failed. Please try again.", { id });
    } finally {
      setBusy(false);
      setPreview(null);
      URL.revokeObjectURL(localUrl);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api(`/admin/courses/${course.id}/image`, { method: "DELETE" });
      toast.success("Uploaded photo removed. The built-in photo is shown instead.");
      onChange();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Couldn't remove the photo.");
    } finally {
      setBusy(false);
    }
  }

  function onDrop(event: DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void upload(file);
  }

  const fallback = courseImageFor(course.imageKey);
  const current = preview ?? course.imageUrl;

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Course photo</h2>
        <p className="text-sm text-muted">
          Upload your own photo for cards and the course page. Landscape works best, at least 1600px wide. JPEG, PNG, WebP or
          AVIF up to {MAX_MB} MB.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-[18rem_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-brand-soft">
          {current ? (
            // A plain <img> also shows the local preview while uploading.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt={`${course.title} photo`} className={cn("size-full object-cover", busy && "opacity-60")} />
          ) : (
            <Image src={fallback.src} alt={fallback.alt} fill sizes="288px" placeholder="blur" className="object-cover" />
          )}
          {!course.imageUrl && !preview && (
            <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-xs font-medium text-ink">
              Built-in photo
            </span>
          )}
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            dragging ? "border-brand bg-brand-soft" : "border-line",
          )}
        >
          <p className="text-sm text-muted">Drag a photo here, or</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button type="button" onClick={() => input.current?.click()} loading={busy}>
              {course.imageUrl ? "Replace photo" : "Upload photo"}
            </Button>
            {course.imageUrl && (
              <Button type="button" variant="ghost-danger" onClick={remove} disabled={busy}>
                Remove
              </Button>
            )}
          </div>
          <input
            ref={input}
            type="file"
            accept={ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void upload(file);
            }}
          />
        </div>
      </div>
    </Card>
  );
}

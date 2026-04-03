"use client";

import { useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableImageItem({ id, img, index, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative border rounded-lg p-2 bg-white"
    >
      <button
        type="button"
        className="w-full text-left cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <img
          src={img}
          alt={`Uploaded ${index + 1}`}
          className="w-full h-24 object-cover rounded"
        />
      </button>

      {index === 0 && (
        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-2 py-1 rounded">
          Cover
        </span>
      )}

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 rounded"
      >
        X
      </button>
    </div>
  );
}

export default function ImageUploader({ images = [], setImages }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploading(true);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;

        const base64 = await fileToBase64(file);

        const res = await fetch("/api/uploads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file: base64 }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Upload API error:", data);
          alert(data.details || data.error || "Upload failed");
          continue;
        }

        uploadedUrls.push(data.url);
      }

      setImages([...images, ...uploadedUrls]);
    } catch (error) {
      console.error("Uploader error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  function removeImage(index) {
    setImages(images.filter((_, i) => i !== index));
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img === active.id);
    const newIndex = images.findIndex((img) => img === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    setImages(arrayMove(images, oldIndex, newIndex));
  }

  return (
    <div className="md:col-span-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-xl p-6 text-center bg-gray-50"
      >
        <p>Drag & drop images</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploading && <p className="mt-2">Uploading...</p>}

      {images.length > 0 && (
        <>
          <p className="mt-4 text-sm text-gray-600">
            Drag images to reorder. First image will be the cover image.
          </p>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {images.map((img, i) => (
                  <SortableImageItem
                    key={`${img}-${i}`}
                    id={img}
                    img={img}
                    index={i}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
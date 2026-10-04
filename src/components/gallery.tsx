"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag } from "lucide-react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] border border-rosewash bg-gradient-to-br from-blush via-rosewash to-blush">
        <Tag size={64} className="text-brand/25" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-rosewash bg-blush shadow-card">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[Math.min(active, images.length - 1)]}
            alt={title}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                i === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt={`${title} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

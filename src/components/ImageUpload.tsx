import { useRef, useState } from "react";
import { CloseIcon } from "./Icons";

/**
 * Reads an image file, downscales it on a canvas (so localStorage stays small)
 * and returns a JPEG data-URL.
 */
function readImageFile(file: File, maxDim = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("That file is not an image."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The file could not be read."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("The image could not be decoded."));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.fillStyle = "#171510";
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  hint = "PNG / JPG — downscaled & stored locally",
  previewClass = "h-36",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  hint?: string;
  previewClass?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const handleFile = async (file: File | undefined | null) => {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await readImageFile(file);
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="font-mono text-[9px] tracking-[0.24em] uppercase text-paper/45">{label}</label>
        {value && (
          <button
            type="button"
            data-cursor
            onClick={() => onChange("")}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] uppercase text-paper/40 hover:text-[#d98a72] transition-colors"
          >
            <CloseIcon className="w-3 h-3" /> Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        data-cursor
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`mt-2 w-full relative overflow-hidden border-2 border-dashed transition-all duration-300 group ${
          drag ? "border-brass bg-brass/10" : value ? "border-paper/25 hover:border-brass/60" : "border-paper/20 hover:border-brass/60 hover:bg-paper/4"
        }`}
        aria-label={`Upload ${label}`}
      >
        {value ? (
          <span className={`block ${previewClass} plate-dark`}>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            />
          </span>
        ) : (
          <span className={`flex flex-col items-center justify-center gap-2 ${previewClass} text-paper/40`}>
            {busy ? (
              <span className="w-5 h-5 border-2 border-paper/20 border-t-brass rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-7 h-7 text-brass">
                <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" strokeLinecap="round" />
              </svg>
            )}
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase">
              {busy ? "Processing…" : drag ? "Drop it here" : "Click or drop an image"}
            </span>
          </span>
        )}
      </button>

      {err ? (
        <p className="mt-1.5 font-mono text-[9px] tracking-[0.16em] uppercase text-[#d98a72]">{err}</p>
      ) : (
        <p className="mt-1.5 font-mono text-[8px] tracking-[0.16em] uppercase text-paper/30">{hint}</p>
      )}
    </div>
  );
}

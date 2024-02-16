import { ImageType } from "@/types/client.types";
import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import DeleteIcon from "../icons/DeleteIcon";

interface Props {
  onChange: (arg: File[]) => void;
  value: File[];
}

export default function ImagesInput({ onChange, value }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [showImages, setShowImages] = useState<ImageType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files === null) return;
    for (let i = 0; i < files.length; i++) {
      if (!showImages.some((el) => el.name === files[i].name)) {
        setShowImages((prev) => [...prev, { name: files[i].name, url: URL.createObjectURL(files[i]) }]);

        console.log(value);
      }
    }
  };

  const selectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
    handleFiles(files);
  };

  const deleteFile = (idx: number) => {
    setShowImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  return (
    <div className="w-full middle-text">
      <input
        type="file"
        id="imageUpload"
        style={{ display: "none" }}
        multiple={true}
        accept="image/*"
        onChange={selectFile}
        ref={inputRef}
      />
      <button
        role="button"
        className={`w-full h-131 flex justify-center items-center border rounded-10 border-black border-dashed ${
          isDragging && "bg-gray-30"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          inputRef.current?.click();
        }}
        type="button"
      >
        <div className="pointer-events-none">
          {isDragging ? "이곳에 드롭해주세요" : "클릭 혹은 파일을 드롭해주세요"}
        </div>
      </button>
      <div className="grid w-full grid-cols-10 gap-8 mt-8">
        {showImages.map((el, idx) => (
          <div className="aspect-square relative overflow-hidden rounded-lg" key={idx}>
            <button
              className="h-24 w-24 absolute right-0 top-0 z-10 rounded-full bg-gray-900 flex items-center justify-center cursor-pointer text-white"
              onClick={() => deleteFile(idx)}
              type="button"
            >
              <DeleteIcon />
            </button>
            <Image src={el.url} alt={el.name} sizes="75px" fill style={{ objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

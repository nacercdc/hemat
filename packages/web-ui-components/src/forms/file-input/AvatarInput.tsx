/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

const maxImageSize = 5000000;

interface Props {
  initialFilePreviewURL?: string;
  file?: File;
  onChange: (f?: File) => void;
}

export const AvatarInput = forwardRef<HTMLInputElement, Props>(
  ({ initialFilePreviewURL, file, onChange }, ref) => {
    const [filePreviewURL, setFilePreviewURL] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!file) {
        setFilePreviewURL("");
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setFilePreviewURL(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }, [file]);

    const pickImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        e.target.files &&
        e.target.files.length === 1 &&
        e.target.files?.[0]!.size <= maxImageSize
      ) {
        onChange(e.target.files[0]);
      } else {
        onChange(undefined);
      }
    };
    return (
      <div className="cursor-pointer">
        <input
          className="hidden"
          ref={ref ? ref : inputRef}
          type="file"
          accept=".jpg,.png,.jpeg"
          onChange={pickImageHandler}
        />
        <div
          className="rounded-full w-fit overflow-hidden"
          onClick={() => {
            if (!ref) inputRef.current?.click();
          }}
        >
          {!filePreviewURL && !initialFilePreviewURL && (
            <Icon
              icon="clarity:avatar-line"
              className="w-24 h-24 p-6 bg-primary/10 hover:bg-primary/15"
            />
          )}
          {!filePreviewURL && initialFilePreviewURL && (
            <img
              src={initialFilePreviewURL}
              className="w-24 h-24 rounded-full"
              alt="user-profile-pic"
            />
          )}
          {filePreviewURL && (
            <img
              src={filePreviewURL}
              className="w-24 h-24"
              alt="user-profile-pic"
            />
          )}
        </div>
      </div>
    );
  }
);

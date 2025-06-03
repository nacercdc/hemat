/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Icon } from "@iconify/react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { FormControlVariants } from "../form-control";
import { FormControl } from "../form-control";
import { Button } from "../button";
import type { Input as ShadcnInput } from "../../shadcn-ui";
import { Input } from "../input";

export interface FileInputRef {
  click: () => void;
}

interface PreviewFile {
  url: string;
  type: string;
  name: string;
}

const fileInputVariants = cva(
  "flex w-full rounded-md border text-sm transition focus-visible:ring-2 relative",
  {
    variants: {
      variant: {
        default:
          "border-basic-500 focus:border-basic-600 focus-visible:ring-basic-500",
        destructive:
          "border-destructive-500 focus:border-destructive-600 focus-visible:ring-destructive-500",
        success:
          "border-success-500 focus:border-success-600 focus-visible:ring-success-500",
        info: "border-info-500 focus:border-info-600 focus-visible:ring-info-500",
        warning:
          "border-warning-500 focus:border-warning-600 focus-visible:ring-warning-500",
      },
      size: {
        sm: "h-9",
        md: "h-10",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type fileInputVariants = VariantProps<typeof fileInputVariants>;

type ShadcnFileInputPropsWithoutColor = Omit<
  React.ComponentProps<typeof ShadcnInput>,
  "className" | "style" | "variant" | "size" | "color" | "onChange"
>;

export interface FileInputProps extends ShadcnFileInputPropsWithoutColor {
  label?: string;
  error?: string;
  description?: string;
  showPreview?: boolean;
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  variant?: fileInputVariants["variant"];
  chooserLink?: boolean;
  size?: fileInputVariants["size"];
  labelVariant?: FormControlVariants["variant"];
  labelSize?: FormControlVariants["size"];
  onChange?: (files: File[]) => void;
}

export const FileInput = forwardRef<FileInputRef, FileInputProps>(
  (
    {
      name,
      label,
      variant,
      size,
      labelVariant,
      labelSize,
      leftNode,
      rightNode,
      error,
      description,
      chooserLink = true,
      accept,
      multiple,
      showPreview = true,
      onChange,
    },
    ref,
  ) => {
    const [preview, setPreview] = useState<PreviewFile[]>([]);
    const [files, setFiles] = useState<File[]>();
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => {
      return {
        click: () => {
          if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.click();
          }
        },
      };
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        preview.forEach(({ url }) => URL.revokeObjectURL(url));

        const newPreviews = Array.from(files).map((file) => ({
          url: URL.createObjectURL(file),
          type: file.type,
          name: file.name,
        }));

        setPreview(newPreviews);
      } else {
        setPreview([]);
        setFiles([]);
      }

      setFiles(Array.from(e.target.files || []));

      if (onChange) {
        onChange(Array.from(e.target.files || []));
      }
    };

    const onFileRemoveHandler = (url: string, fileName: string) => {
      setPreview(preview.filter((p) => p.url !== url));

      const filteredFiles = Array.from(files || []).filter(
        (f) => f.name !== fileName,
      );

      setFiles(filteredFiles);

      onChange?.(filteredFiles);
    };

    return (
      <FormControl
        name={name}
        label={label}
        variant={labelVariant}
        size={labelSize}
        error={error}
        description={description}
      >
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="relative flex-1 flex gap-2 overflow-hidden">
              <input
                className="hidden"
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                aria-invalid={error ? "true" : "false"}
                onChange={handleFileChange}
              />
              <div className="w-full rounded-md">
                <Input
                  name={name ?? ""}
                  value={
                    files && files.length > 0
                      ? `${files.length} files chosen`
                      : "No file chosen"
                  }
                  size={size}
                  leftNode={leftNode}
                  rightNode={rightNode}
                  disabled
                />
              </div>
              {chooserLink && (
                <Button
                  type="button"
                  onClick={() => {
                    inputRef.current!.value = "";
                    inputRef.current?.click();
                  }}
                  color={variant}
                  size={size}
                >
                  Choose File
                </Button>
              )}
            </div>
          </div>

          {showPreview && preview.length > 0 && (
            <div className="flex flex-col gap-2 overflow-auto mt-10 py-1 w-[80%]">
              {preview.map(({ url, type, name }) => (
                <div
                  key={url}
                  className="relative aspect-square rounded-lg hover:border-[0.25px] hover:border-dark-lighter w-[95%] h-10 px-1 mt-0.5 group flex items-center"
                >
                  {type.startsWith("video/") ? (
                    <div className="flex items-center gap-2 w-full">
                      <Icon icon="catppuccin:video" className="h-6 w-6" />
                      <p className="w-full text-xs">{name}</p>
                    </div>
                  ) : type.startsWith("image/") ? (
                    <div className="flex items-center gap-2 w-full">
                      <img
                        src={url}
                        alt="Preview"
                        className="h-6 w-6 object-contain"
                      />
                      <p className="w-full text-xs">{name}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <Icon icon="mage:file-2" className="h-6 w-6" />
                      <p className="w-full text-xs">{name}</p>
                    </div>
                  )}
                  <Icon
                    icon="zondicons:close-solid"
                    onClick={() => onFileRemoveHandler(url, name)}
                    className="hidden group-hover:flex w-3 h-3 absolute -right-[6px] -top-[6px] text-dark-lighter bg-primary-50 text-lg border-primary-50 rounded-full cursor-pointer z-20"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </FormControl>
    );
  },
);

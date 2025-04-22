"use client";
import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import React, { useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../shadcn-ui/utils/cn";
import { FormControl } from "../form-control";
import { buttonVariants } from "../button";
import type { Input as ShadcnInput } from "../../shadcn-ui";
import { omit } from "@etm/utilities";

interface PreviewFile {
  url: string;
  type: string;
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
        sm: "h-8",
        md: "h-9",
        lg: "h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type fileInputVariants = VariantProps<typeof fileInputVariants>;

type ShadcnFileInputPropsWithoutColor = Omit<
  React.ComponentProps<typeof ShadcnInput>,
  "className" | "style" | "variant" | "size" | "color"
>;

export interface FileInputProps extends ShadcnFileInputPropsWithoutColor {
  label?: string;
  error?: string;
  description?: string;
  showPreview?: boolean;
  leftNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  variant?: fileInputVariants["variant"];
  size?: fileInputVariants["size"];
}

export const FileInput = ({
  name,
  label,
  variant,
  size,
  leftNode,
  rightNode,
  error,
  description,
  accept,
  multiple,
  showPreview = true,
  onChange,
  ...props
}: FileInputProps) => {
  const [preview, setPreview] = useState<PreviewFile[]>([]);
  const [fileNames, setFileNames] = useState<string>("No file chosen");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFileNames(
        Array.from(files)
          .map((f) => f.name)
          .join(", ")
      );

      preview.forEach(({ url }) => URL.revokeObjectURL(url));

      const newPreviews = Array.from(files)
        .filter(
          (file) =>
            file.type.startsWith("image/") || file.type.startsWith("video/")
        )
        .map((file) => ({
          url: URL.createObjectURL(file),
          type: file.type,
        }));

      setPreview(newPreviews);
    } else {
      setFileNames("No file chosen");
      setPreview([]);
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <FormControl
      name={name}
      label={label}
      error={error}
      description={description}
    >
      <div className="space-y-2">
        <div
          className={cn(
            fileInputVariants({ variant, size }),
            "flex items-center"
          )}
        >
          {leftNode && (
            <span className="absolute left-3 flex items-center h-full">
              {leftNode}
            </span>
          )}
          <div className="relative flex-1 flex items-center overflow-hidden">
            <label
              htmlFor={name}
              className={cn(
                buttonVariants({
                  variant: "default",
                  color: variant === "default" ? "default" : variant,
                  size,
                }),
                "rounded-l-md border-r cursor-pointer flex items-center "
              )}
            >
              Choose File
            </label>
            <span className="px-3 truncate flex-1 ">{fileNames}</span>
            <input
              {...omit(
                props as ComponentPropsWithoutRef<typeof ShadcnInput>,
                "className",
                "style",
                "color",
                "size"
              )}
              id={name}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="sr-only"
              aria-invalid={error ? "true" : "false"}
            />
          </div>
          {rightNode && (
            <span className="absolute right-3 flex items-center h-full">
              {rightNode}
            </span>
          )}
        </div>

        {showPreview && preview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {preview.map(({ url, type }) => (
              <div
                key={url}
                className="relative aspect-square rounded-lg overflow-hidden border border-basic-200"
              >
                {type.startsWith("video/") ? (
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img
                    src={url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FormControl>
  );
};

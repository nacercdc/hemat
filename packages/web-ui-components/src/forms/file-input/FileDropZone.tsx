/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useCallback,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";
import { cn } from "../../shadcn-ui/utils/cn";

export interface DropZoneRef {
  clearFile: (name: string) => void;
  clearAll: () => void;
}

export type FileWithPreview = File & {
  preview: string | null;
};

interface RejectedFile {
  file: File;
  errors: {
    code: string;
    message: string;
  }[];
}

interface Props {
  maxFiles?: number;
  maxSizeMB?: number;
  message?: string;
  accept?: string;
  dragAreaHeight?: number;
  showRejectedFiles?: boolean;
  onFilesChange?: (files: FileWithPreview[]) => void;
}

export const FileDropZone = forwardRef<DropZoneRef, Props>(
  (
    {
      maxFiles = 5,
      maxSizeMB = 10,
      message,
      accept,
      dragAreaHeight,
      showRejectedFiles = true,
      onFilesChange,
    },
    ref
  ) => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [rejected, setRejected] = useState<RejectedFile[]>([]);

    useEffect(() => {
      return () => {
        files.forEach((file) => {
          if (file.preview) URL.revokeObjectURL(file.preview);
        });
      };
    }, [files]);

    useEffect(() => {
      if (onFilesChange) {
        onFilesChange(files);
      }
    }, [files, onFilesChange]);

    const onDrop = useCallback(
      (acceptedFiles: File[], rejectedFiles: RejectedFile[]) => {
        if (acceptedFiles?.length) {
          setFiles((previousFiles) => [
            ...previousFiles,
            ...acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: file.type.startsWith("image/")
                  ? URL.createObjectURL(file)
                  : null,
              })
            ),
          ]);
        }

        if (rejectedFiles?.length) {
          setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
        }
      },
      []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: (accept ?? "*") as unknown as Accept,
      maxSize: maxSizeMB * 1024 * 1024,
      maxFiles,
      onDrop: onDrop as any,
    });

    const removeFile = (name: string) => {
      setFiles((files) => {
        const fileToRemove = files.find((file) => file.name === name);
        if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
        return files.filter((file) => file.name !== name);
      });
    };

    const removeRejected = (name: string) => {
      setRejected((files) => files.filter(({ file }) => file.name !== name));
    };

    const removeAll = useCallback(() => {
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      setFiles([]);
      setRejected([]);
    }, [files]);

    useImperativeHandle(ref, () => {
      return {
        clearFile: (name: string) => removeFile(name),
        clearAll: () => removeAll(),
      };
    }, [removeAll]);

    return (
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors flex items-center justify-center bg-card",
            isDragActive
              ? "border-primary bg-primary-50"
              : "border-dark-light hover:border-dark"
          )}
          style={{ height: `${dragAreaHeight}px` }}
        >
          <input {...getInputProps()} accept={accept} />
          {
            <div className="flex flex-col items-center justify-center gap-2 text-sm">
              <Icon icon="feather:upload" className="text-2xl text-dark" />
              {isDragActive ? (
                <p className="text-primary">Drop files here...</p>
              ) : (
                <>
                  <p className="font-medium">
                    {message ?? "Drag & drop files here, or click to browse"}
                  </p>
                  <p className="text-xs text-dark">
                    (max - {maxSizeMB}MB per file)
                  </p>
                </>
              )}
            </div>
          }
        </div>

        {files.length > 0 && (
          <div className="space-y-3 mb-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">
                Selected Files ({files.length}/{maxFiles})
              </h3>
              <button
                type="button"
                onClick={removeAll}
                className="text-sm text-destructive hover:text-destructive-700"
              >
                Clear all
              </button>
            </div>

            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-10 h-10 object-cover rounded"
                        onLoad={() => {
                          if (file.preview) URL.revokeObjectURL(file.preview);
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-dark-lighter rounded">
                        <Icon icon="feather:file" className="text-dark" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-dark">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.name)}
                    className="text-dark hover:text-destructive"
                  >
                    <Icon icon="feather:x" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {rejected.length > 0 && showRejectedFiles && (
          <div className="space-y-3">
            <h3 className="font-medium text-destructive">Rejected Files</h3>
            <div className="space-y-2">
              {rejected.map(({ file, errors }) => (
                <div
                  key={file.name}
                  className="p-3 bg-destructive-50 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-destructive-100 rounded">
                        <Icon
                          icon="feather:file"
                          className="text-destructive"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-dark">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRejected(file.name)}
                      className="text-destructive-500 hover:text-destructive-700"
                    >
                      <Icon icon="feather:x" />
                    </button>
                  </div>
                  <ul className="mt-2 text-xs text-destructive">
                    {errors.map((error) => (
                      <li key={error.code}>- {error.message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

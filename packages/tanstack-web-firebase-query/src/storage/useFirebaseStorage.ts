/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
"use client";

import { useMutation } from "@tanstack/react-query";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { useFirebase } from "../providers/firebase/useFirebase";

interface FileUploadParams {
  file: File;
  path: string;
}

interface FileDownloadParams {
  path: string;
  fileName?: string;
}

export const useFirebaseStorage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { storage } = useFirebase();

  const uploadMutation = useMutation<string, Error, FileUploadParams>({
    mutationFn: async ({ file, path }) => {
      setUploadProgress(0);
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setUploadProgress(0);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              setUploadProgress(100);
              resolve(url);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    },
  });

  const downloadMutation = useMutation<Blob, Error, FileDownloadParams>({
    mutationFn: async ({ path }) => {
      setDownloadProgress(0);
      const storageRef = ref(storage, path);
      const url = await getDownloadURL(storageRef);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.open("GET", url);

        xhr.onload = () => {
          if (xhr.status === 200) {
            setDownloadProgress(100);
            resolve(xhr.response);
          } else {
            reject(new Error("Download failed"));
          }
        };

        xhr.onerror = () => {
          setDownloadProgress(0);
          reject(new Error("Network error"));
        };

        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setDownloadProgress(progress);
          }
        };

        xhr.send();
      });
    },
  });

  return {
    upload: {
      mutate: uploadMutation.mutate,
      isLoading: uploadMutation.isPending,
      progress: uploadProgress,
      error: uploadMutation.error,
      data: uploadMutation.data,
    },
    download: {
      mutate: downloadMutation.mutate,
      isLoading: downloadMutation.isPending,
      progress: downloadProgress,
      error: downloadMutation.error,
      data: downloadMutation.data,
    },
  };
};

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useMutation } from "@tanstack/react-query";
import type { FirebaseStorageTypes } from "@react-native-firebase/storage";
import storage from "@react-native-firebase/storage";
import { useState } from "react";
import { Platform } from "react-native";
import RNFetchBlob from "rn-fetch-blob";

interface FileUploadParams {
  fileUri: string;
  path: string;
}

interface FileDownloadParams {
  path: string;
  fileName?: string;
}

export const useFirebaseStorage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const getDownloadPath = (fileName: string) => {
    const dirs = RNFetchBlob.fs.dirs;
    return Platform.select({
      ios: `${dirs.DocumentDir}/${fileName}`,
      android: `${dirs.DownloadDir}/${fileName}`,
    });
  };

  const uploadMutation = useMutation<string, Error, FileUploadParams>({
    mutationFn: async ({ fileUri, path }) => {
      setUploadProgress(0);
      const reference = storage().ref(path) as FirebaseStorageTypes.Reference;
      const task = reference.putFile(fileUri);

      return new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setUploadProgress(0);
            reject(error as Error);
          },
          async () => {
            try {
              const url = await reference.getDownloadURL();
              setUploadProgress(100);
              resolve(url);
            } catch (error) {
              reject(error as Error);
            }
          }
        );
      });
    },
  });

  const downloadMutation = useMutation<string, Error, FileDownloadParams>({
    mutationFn: async ({ path, fileName = "downloadedFile" }) => {
      setDownloadProgress(0);
      const reference = storage().ref(path) as FirebaseStorageTypes.Reference;
      const localPath = getDownloadPath(fileName);
      if (!localPath) throw new Error("Local path is not found.");
      const task = reference.writeToFile(localPath);
      return new Promise((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setDownloadProgress(progress);
          },
          (error) => {
            setDownloadProgress(0);
            reject(error as Error);
          },
          () => {
            setDownloadProgress(100);
            resolve(localPath);
          }
        );
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

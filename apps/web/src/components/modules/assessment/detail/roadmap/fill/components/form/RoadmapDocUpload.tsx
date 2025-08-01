"use client";

import type { DropZoneRef, FileWithPreview } from "@etm/web-ui-components";
import { Icon } from "@iconify/react";
import { Button, FileDropZone, useToast } from "@etm/web-ui-components";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";

interface Props {
  roadmapAnswerId: string | null;
  refetchAnswer: () => void;
}

export function RoadmapDocUpload({ roadmapAnswerId, refetchAnswer }: Props) {
  const params = useParams();

  const { toast } = useToast();

  const [docFile, setDocFile] = useState<FileWithPreview>();

  const dobRef = useRef<DropZoneRef>(null);

  const { mutate: uploadDoc, ...uploadDocState } = useAddMutation<
    { id: string; url: string },
    FormData
  >(
    `/assessments/${params.id as string}/roadmaps/sub-component/${roadmapAnswerId}/document`
  );

  const onUploadHandler = () => {
    const formData = new FormData();
    if (!docFile) return;
    formData.append("file", docFile);

    uploadDoc(
      {
        data: formData,
        multipart: true,
      },
      {
        onSuccess: () => {
          dobRef.current?.clearFile(docFile.name);
          refetchAnswer();
          toast({
            title: "Success",
            message: "Your document has been uploaded successfully.",
            variant: "success",
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-full gap-1">
      <FileDropZone
        ref={dobRef}
        disabled={!roadmapAnswerId}
        maxFiles={1}
        maxSizeMB={5}
        accept=".pdf, .doc, .docx, .xls, .xlsx"
        showRejectedFiles={false}
        message="Drag your drop you document, or click to browse"
        disabledMessage="Upload disabled because you haven't filled your roadmap."
        onFilesChange={(files) => {
          setDocFile(files[0]);
        }}
      />
      <Button
        type="button"
        full
        loading={uploadDocState.isPending}
        rightNode={<Icon icon="icons8:upload-2" className="w-6 h-6" />}
        disabled={!roadmapAnswerId || !docFile}
        onClick={onUploadHandler}
      >
        Upload
      </Button>
    </div>
  );
}

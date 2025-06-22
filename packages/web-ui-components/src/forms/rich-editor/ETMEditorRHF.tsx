/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ToolbarContext } from "./context/ToolbarContext";
import { useEffect, useState } from "react";
import { theme as EditorTheme } from "./themes/EditorTheme";
import { Controller } from "react-hook-form";
import { Editor } from "./Editor";
import ETMEditorNodes from "./nodes/ETMEditorNodes";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { EditorProps } from "./Editor";

import "./themes/editorGlobals.css";
import { ExtendedTextNode } from "./nodes/ExtendedTextNode";
import { TextNode } from "lexical";

interface Props<T extends FieldValues>
  extends Omit<EditorProps, "onChange" | "value"> {
  control: Control<T>;
  name: Path<T>;
}

export const ETMEditorRHF = <T extends FieldValues>({
  control,
  name,
  ...richEditorProps
}: Props<T>) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const initialConfig = {
    editorState: null,
    namespace: "ETMEditor",
    nodes: [
      ...ETMEditorNodes,
      ExtendedTextNode,
      {
        replace: TextNode,
        with: (node: TextNode) => new ExtendedTextNode(node.__text),
        withKlass: ExtendedTextNode,
      },
    ],
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarContext>
            <Editor
              {...richEditorProps}
              value={value}
              onChange={onChange}
              name={name}
              error={error?.message}
            />
          </ToolbarContext>
        </LexicalComposer>
      )}
    />
  );
};

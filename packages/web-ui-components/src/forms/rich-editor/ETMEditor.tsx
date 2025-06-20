"use client";

import { forwardRef, useEffect, useState } from "react";
import { theme as EditorTheme } from "./themes/EditorTheme";
import { RichEditor } from "./RichEditor";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ToolbarContext } from "./context/ToolbarContext";
import ETMEditorNodes from "./nodes/ETMEditorNodes";
import type { ETMEditorRef } from "./RichEditor";

import "./themes/editorGlobals.css";

interface Props {
  label: string;
  description?: string;
  placeholder?: string;
  initialEditorState?: string;
  isEditorEnabled?: boolean;
  onEditorStateChange?: (state: string) => void;
}

export const ETMEditor = forwardRef<ETMEditorRef, Props>(
  (
    {
      initialEditorState,
      isEditorEnabled = true,
      label,
      description,
      placeholder,
      onEditorStateChange,
    },
    ref
  ) => {
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
      nodes: [...ETMEditorNodes],
      onError: (error: Error) => {
        throw error;
      },
      theme: EditorTheme,
    };
    return (
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarContext>
          <RichEditor
            ref={ref}
            initialState={initialEditorState}
            isEnabled={isEditorEnabled}
            label={label}
            description={description}
            placeholder={placeholder}
            onChange={onEditorStateChange}
          />
        </ToolbarContext>
      </LexicalComposer>
    );
  }
);

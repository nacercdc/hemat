/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ToolbarContext } from "./context/ToolbarContext";
import { useEffect, useState } from "react";
import { theme as EditorTheme } from "./themes/EditorTheme";
import { Controller } from "react-hook-form";
import { forwardRef } from "react";
import { RichEditor } from "./RichEditor";
import ETMEditorNodes from "./nodes/ETMEditorNodes";
import type { ETMEditorRef } from "./RichEditor";
import type { Control } from "react-hook-form";
import type { RichEditorProps } from "./RichEditor";

interface Props extends Omit<RichEditorProps, "onChange, initialState"> {
  control: Control<any>;
  name: string;
}

export const ETMEditorRHF = forwardRef<ETMEditorRef, Props>(
  ({ control, name, ...richEditorProps }, ref) => {
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
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <LexicalComposer initialConfig={initialConfig}>
            <ToolbarContext>
              <RichEditor
                {...richEditorProps}
                ref={ref}
                initialState={value}
                onChange={(state) => {
                  try {
                    const html = JSON.parse(state);
                    onChange(html);
                  } catch {
                    onChange(state);
                  }
                }}
              />
            </ToolbarContext>
          </LexicalComposer>
        )}
      />
    );
  }
);

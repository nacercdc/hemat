"use client";

import { forwardRef, useEffect, useState } from "react";
import { theme as EditorTheme } from "./themes/EditorTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ToolbarContext } from "./context/ToolbarContext";
import ETMEditorNodes from "./nodes/ETMEditorNodes";
import type { EditorProps, EditorRef } from "./Editor";

import "./themes/editorGlobals.css";
import { TextNode } from "lexical";
import { ExtendedTextNode } from "./nodes/ExtendedTextNode";
import { Editor } from "./Editor";

interface Props extends EditorProps {}

export const ETMEditor = forwardRef<EditorRef, Props>(
  (
    {
      name,
      value,
      label,
      labelSize,
      labelVariant,
      description,
      isEnabled,
      placeholder,
      onChange,
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
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarContext>
          <Editor
            ref={ref}
            name={name}
            label={label}
            labelSize={labelSize}
            labelVariant={labelVariant}
            value={value}
            description={description}
            isEnabled={isEnabled}
            placeholder={placeholder}
            onChange={onChange}
          />
        </ToolbarContext>
      </LexicalComposer>
    );
  }
);

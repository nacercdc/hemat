"use client";

import * as React from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CAN_USE_DOM } from "@lexical/utils";
import { useEffect, useState } from "react";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
// import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ContentEditable from "./ui/ContentEditable";
import "./styles.css";
import ShortcutsPlugin from "./plugins/ShortcutsPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ToolbarContext } from "./context/ToolbarContext";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import { theme as EditorTheme } from "./themes/EditorTheme";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";

import dynamic from "next/dynamic";
const ImagesPlugin = dynamic(() => import("./plugins/ImagesPlugin"), {
  ssr: false,
});

export function RichEditor() {
  const placeholder = "Enter some text...";

  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const { historyState } = useSharedHistoryContext();

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <>
      <ToolbarPlugin
        editor={editor}
        activeEditor={activeEditor}
        setActiveEditor={setActiveEditor}
      />
      <ShortcutsPlugin editor={activeEditor} />
      <div className={`editor-container tree-view`}>
        <AutoFocusPlugin />
        <HistoryPlugin externalHistoryState={historyState} />
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor">
                <ContentEditable placeholder={placeholder} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <CheckListPlugin />
        <ImagesPlugin />
        {/* <TreeViewPlugin /> */}
      </div>
    </>
  );
}

export function ETMEditor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const initialConfig = {
    editorState: null,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: EditorTheme,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarContext>
        <RichEditor />
      </ToolbarContext>
    </LexicalComposer>
  );
}

"use client";

import * as React from "react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { $getRoot, $insertNodes, $isParagraphNode } from "lexical";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { $generateNodesFromDOM } from "@lexical/html";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import OnChangePlugin from "./plugins/OnChangePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ShortcutsPlugin from "./plugins/ShortcutsPlugin";
import ContentEditable from "./ui/ContentEditable";
import ETMEditorNodes from "./nodes/ETMEditorNodes";
import { ToolbarContext } from "./context/ToolbarContext";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import { theme as EditorTheme } from "./themes/EditorTheme";

import "./themes/editorGlobals.css";

import dynamic from "next/dynamic";
import { Separator } from "../../shadcn-ui/separator";
const ImagesPlugin = dynamic(() => import("./plugins/ImagesPlugin"), {
  ssr: false,
});

export interface ETMEditorRef {
  isEmpty: () => boolean;
}

interface RichEditorProps {
  onStateChange?: (state: string) => void;
  initialState?: string;
  isEnabled: boolean;
  label: string;
  description?: string;
  placeholder?: string;
}

const RichEditor = forwardRef<ETMEditorRef, RichEditorProps>(
  (
    {
      onStateChange,
      initialState,
      isEnabled,
      label,
      description,
      placeholder = "",
    },
    ref
  ) => {
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const { historyState } = useSharedHistoryContext();

    editor.setEditable(isEnabled);

    const parseHTMLIntoEditor = React.useCallback(
      (htmlString: string) => {
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(htmlString, "text/html");

          const nodes = $generateNodesFromDOM(editor, dom);

          const root = $getRoot();
          root.clear();

          $insertNodes(nodes);
        });
      },
      [editor]
    );

    const isEmpty = React.useCallback(() => {
      let empty = true;

      editor.read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
          empty = false;
        } else if (children.length === 1) {
          const firstChild = children[0];
          if ($isParagraphNode(firstChild)) {
            empty = firstChild.getTextContent().trim() === "";
          } else {
            empty = false;
          }
        }
      });

      return empty;
    }, [editor]);

    useImperativeHandle(ref, () => {
      return {
        isEmpty,
      };
    }, [isEmpty]);

    useEffect(() => {
      if (initialState) parseHTMLIntoEditor(initialState);
    }, [initialState, parseHTMLIntoEditor]);

    return (
      <div className="flex flex-col gap-2">
        {label && <div className="text-sm font-bold">{label}</div>}
        <div className="flex flex-col border border-basic-300 rounded-md">
          <ToolbarPlugin
            editor={editor}
            activeEditor={activeEditor}
            setActiveEditor={setActiveEditor}
          />
          <Separator className="h-px bg-basic-300 w-full" />
          <ShortcutsPlugin editor={activeEditor} />
          <div className={`editor-container tree-view`}>
            <AutoFocusPlugin />
            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div
                    className={`editor bg-white rounded-b-md ${!isEnabled && "rounded-md"}`}
                  >
                    <ContentEditable placeholder={placeholder} />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ListPlugin hasStrictIndent={true} />
            <TabIndentationPlugin maxIndent={7} />
            <CheckListPlugin />
            <ImagesPlugin />
            {onStateChange && <OnChangePlugin onChange={onStateChange} />}
          </div>
        </div>
        {description && (
          <div className="font-medium text-xs text-dark-light">
            {description}
          </div>
        )}
      </div>
    );
  }
);

interface Props {
  label: string;
  description?: string;
  placeholder?: string;
  initialEditorState?: string;
  onEditorStateChange?: (state: string) => void;
  isEditorEnabled?: boolean;
}

export const ETMEditor = forwardRef<ETMEditorRef, Props>(
  (
    {
      onEditorStateChange,
      initialEditorState,
      isEditorEnabled = true,
      label,
      description,
      placeholder,
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
            onStateChange={onEditorStateChange}
            initialState={initialEditorState}
            isEnabled={isEditorEnabled}
            label={label}
            description={description}
            placeholder={placeholder}
          />
        </ToolbarContext>
      </LexicalComposer>
    );
  }
);

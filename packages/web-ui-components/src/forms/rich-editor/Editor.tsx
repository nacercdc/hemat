"use client";

import * as React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { $getRoot, $isParagraphNode } from "lexical";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import OnChangePlugin from "./plugins/OnChangePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ShortcutsPlugin from "./plugins/ShortcutsPlugin";
import ContentEditable from "./ui/ContentEditable";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";

import dynamic from "next/dynamic";
import { Separator } from "../../shadcn-ui/separator";
import { FormControl, FormControlVariants } from "../form-control";
import { cn } from "../../shadcn-ui/utils/cn";
const ImagesPlugin = dynamic(() => import("./plugins/ImagesPlugin"), {
  ssr: false,
});

import "./themes/editorGlobals.css";

export interface EditorRef {
  isEmpty: () => boolean;
}

export interface EditorProps {
  name: string;
  value: string;
  label: string;
  labelVariant?: FormControlVariants["variant"];
  labelSize?: FormControlVariants["size"];
  description?: string;
  error?: string;
  isEnabled?: boolean;
  placeholder?: string;
  onChange?: (state: string) => void;
}

export const Editor = forwardRef<EditorRef, EditorProps>(
  (
    {
      name,
      value,
      label,
      labelSize,
      labelVariant,
      description,
      error,
      isEnabled = true,
      placeholder = "Start typing...",
      onChange,
    },
    ref
  ) => {
    const [editor] = useLexicalComposerContext();
    const [activeEditor, setActiveEditor] = useState(editor);
    const { historyState } = useSharedHistoryContext();

    editor.setEditable(isEnabled);

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

    return (
      <FormControl
        name={name}
        label={label}
        error={error}
        variant={labelVariant}
        size={labelSize}
        description={description}
      >
        <div
          className={cn(
            "flex flex-col border border-basic-300 rounded-md",
            error && "border-destructive-500"
          )}
        >
          <ToolbarPlugin
            editor={editor}
            activeEditor={activeEditor}
            setActiveEditor={setActiveEditor}
          />
          <Separator className="h-px bg-basic-300 w-full" />
          <ShortcutsPlugin editor={activeEditor} />
          <div className="editor-container tree-view">
            <AutoFocusPlugin />
            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div
                    className={`editor bg-white rounded-b-md ${!isEnabled && "rounded-md"}`}
                  >
                    <ContentEditable
                      placeholder={placeholder}
                      className="!focus:border-none h-full outline-none px-2 py-2"
                    />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ListPlugin hasStrictIndent={true} />
            <TabIndentationPlugin maxIndent={7} />
            <CheckListPlugin />
            <ImagesPlugin />
            {onChange && <OnChangePlugin onChange={onChange} value={value} />}
          </div>
        </div>
      </FormControl>
    );
  }
);

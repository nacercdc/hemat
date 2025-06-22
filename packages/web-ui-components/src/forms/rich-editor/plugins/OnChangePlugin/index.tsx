"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin as LexicalOnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useEffect, useState } from "react";
import { $getRoot, $insertNodes } from "lexical";

export default function OnChangePlugin({
  value,
  onChange,
}: {
  value: string;
  onChange: (stateStr: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (!value || !isFirstRender) return;

    setIsFirstRender(false);
    editor.update(() => {
      const currentHTML = $generateHtmlFromNodes(editor);
      if (currentHTML !== value) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().clear();
        $insertNodes(nodes);
      }
    });
  }, [editor, value, isFirstRender]);

  return (
    <LexicalOnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          onChange($generateHtmlFromNodes(editor));
        });
      }}
    />
  );
}

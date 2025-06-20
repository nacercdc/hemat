"use client";

import { useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";

export default function OnChangePlugin({
  onChange,
}: {
  onChange: (editorState: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const getEditorStateAsHTML = useCallback(() => {
    return new Promise((resolve) => {
      editor.update(() => {
        const html = $generateHtmlFromNodes(editor, null);
        resolve(html);
      });
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(async () =>
      onChange(JSON.stringify(await getEditorStateAsHTML()))
    );
  }, [editor, getEditorStateAsHTML, onChange]);

  return null;
}

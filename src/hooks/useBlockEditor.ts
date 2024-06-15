'use client';
import { useEffect, useState } from 'react';

import { Editor, useEditor } from '@tiptap/react';
import { TiptapCollabProvider, WebSocketStatus } from '@hocuspocus/provider';
import type { Doc as YDoc } from 'yjs';

import { ExtensionKit } from '@/extensions/extension-kit';
import { initialContent } from '@/lib/data/initialContent';

declare global {
  interface Window {
    editor: Editor | null;
  }
}

export const useBlockEditor = ({
  ydoc,
  provider,
}: {
  aiToken?: string;
  ydoc: YDoc;
  provider?: TiptapCollabProvider | null | undefined;
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    WebSocketStatus.Connecting
  );
  const editor = useEditor(
    {
      autofocus: true,
      onCreate: ({ editor }) => {
        if (editor.isEmpty) {
          editor.commands.setContent(initialContent);
        }
      },
      extensions: [...ExtensionKit()],
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc]
  );

  const characterCount = editor?.storage.characterCount || {
    characters: () => 0,
    words: () => 0,
  };

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollabState(event.status);
    });
  }, [provider]);
  if (typeof window !== 'undefined') window.editor = editor;

  return { editor, characterCount, collabState };
};

'use client'

import { EditorContent, PureEditorContent } from '@tiptap/react'
import React, { useContext, useMemo, useRef } from 'react'

import { LinkMenu } from '@/app/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/app/styles/index.css'

import { Loader } from '@/app/components/ui/Loader'
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import { useAIState } from '@/hooks/useAIState'
import { createPortal } from 'react-dom'
import { TiptapProps } from './types'
import { TextMenu } from '../menus/TextMenu'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { EditorContext } from '@/app/context/EditorContext'

export const BlockEditor = ({ aiToken, ydoc, provider }: TiptapProps) => {
  const { isAiLoading } = useContext(EditorContext);
  const menuContainerRef = useRef(null)
  const editorRef = useRef<PureEditorContent | null>(null)

  const { editor } = useBlockEditor({ aiToken, ydoc, provider })

  if (!editor) {
    return null
  }

  const aiLoaderPortal = createPortal(<Loader label="AI is now doing its job." />, document.body)

  return (
    <>
      <div className="flex h-full" ref={menuContainerRef}>
        <div className="relative flex flex-col flex-1 h-full overflow-hidden">
          <EditorContent editor={editor} ref={editorRef as any} className="flex-1 overflow-y-auto" />
          {/* <ContentItemMenu editor={editor} /> */}
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          {/* <ImageBlockMenu editor={editor} appendTo={menuContainerRef} /> */}
        </div>
      </div>
      {isAiLoading && aiLoaderPortal}
    </>
  )
}

export default BlockEditor

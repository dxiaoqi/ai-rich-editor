'use client'

import { useState } from 'react'
import { FileTree } from '@/components/file-tree'
import { Editor } from '@/components/editor'
import { useFileStorage } from '@/hooks/use-file-storage'

export default function Home() {
  const {
    files,
    activeFileId,
    setActiveFileId,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    updateFileContent,
    getFileContent,
  } = useFileStorage()

  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  const handleCreateFile = (parentId?: string) => {
    const name = prompt('Enter file name:')
    if (name) {
      const fileId = createFile(name, parentId)
      setActiveFileId(fileId)
    }
  }

  const handleCreateFolder = (parentId?: string) => {
    const name = prompt('Enter folder name:')
    if (name) {
      createFolder(name, parentId)
    }
  }

  const handleDelete = (nodeId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteNode(nodeId)
    }
  }

  const handleRename = (nodeId: string, newName: string) => {
    renameNode(nodeId, newName)
  }

  const handleContentChange = (content: string) => {
    if (activeFileId) {
      updateFileContent(activeFileId, content)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-muted/30">
        <FileTree
          files={files}
          activeFileId={activeFileId}
          onFileSelect={setActiveFileId}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onDelete={handleDelete}
          onRename={handleRename}
        />
      </div>

      {/* Editor */}
      <div className="flex-1">
        {activeFileId ? (
          <Editor
            key={activeFileId}
            fileId={activeFileId}
            content={getFileContent(activeFileId)}
            onChange={handleContentChange}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>Select a file to start editing</p>
          </div>
        )}
      </div>
    </div>
  )
}

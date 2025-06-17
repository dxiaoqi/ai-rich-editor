'use client'

import { useState } from 'react'
import { FileNode } from '@/types'
import { ChevronRight, ChevronDown, File, Folder, Plus, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface FileTreeProps {
  files: FileNode[]
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onCreateFile: (parentId?: string) => void
  onCreateFolder: (parentId?: string) => void
  onDelete: (nodeId: string) => void
  onRename: (nodeId: string, newName: string) => void
}

export function FileTree({
  files,
  activeFileId,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDelete,
  onRename,
}: FileTreeProps) {
  return (
    <div className="h-full overflow-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Files</h2>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onCreateFile()}
            title="New File"
          >
            <File className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onCreateFolder()}
            title="New Folder"
          >
            <Folder className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        {files.map((node) => (
          <FileTreeNode
            key={node.id}
            node={node}
            activeFileId={activeFileId}
            onFileSelect={onFileSelect}
            onCreateFile={onCreateFile}
            onCreateFolder={onCreateFolder}
            onDelete={onDelete}
            onRename={onRename}
            level={0}
          />
        ))}
      </div>
    </div>
  )
}

interface FileTreeNodeProps {
  node: FileNode
  activeFileId: string | null
  onFileSelect: (fileId: string) => void
  onCreateFile: (parentId?: string) => void
  onCreateFolder: (parentId?: string) => void
  onDelete: (nodeId: string) => void
  onRename: (nodeId: string, newName: string) => void
  level: number
}

function FileTreeNode({
  node,
  activeFileId,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDelete,
  onRename,
  level,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const [showActions, setShowActions] = useState(false)

  const handleClick = () => {
    if (node.type === 'file') {
      onFileSelect(node.id)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const handleRename = () => {
    if (editName.trim() && editName !== node.name) {
      onRename(node.id, editName)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setEditName(node.name)
      setIsEditing(false)
    }
  }

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-accent',
          activeFileId === node.id && 'bg-accent'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {node.type === 'folder' && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        )}
        {node.type === 'folder' ? (
          <Folder className="h-4 w-4 text-muted-foreground" />
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            autoFocus
          />
        ) : (
          <button
            onClick={handleClick}
            className="flex-1 text-left truncate"
          >
            {node.name}
          </button>
        )}
        {showActions && !isEditing && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100">
            {node.type === 'folder' && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreateFile(node.id)
                  }}
                  title="New File"
                >
                  <File className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreateFolder(node.id)
                  }}
                  title="New Folder"
                >
                  <Folder className="h-3 w-3" />
                </Button>
              </>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              title="Rename"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.id)
              }}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.id}
              node={child}
              activeFileId={activeFileId}
              onFileSelect={onFileSelect}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
              onDelete={onDelete}
              onRename={onRename}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
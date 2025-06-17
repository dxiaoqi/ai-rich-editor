import { useState, useCallback } from 'react'
import { FileNode } from '@/types'

export function useFileStorage() {
  const [files, setFiles] = useState<FileNode[]>([])
  const [activeFileId, setActiveFileId] = useState<string | null>(null)

  // 生成唯一ID
  const generateId = () => {
    return `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // 创建文件
  const createFile = useCallback((name: string, parentId?: string) => {
    const newFile: FileNode = {
      id: generateId(),
      name,
      type: 'file',
      content: '',
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setFiles(prev => {
      if (parentId) {
        // 如果有父文件夹，添加到父文件夹的children中
        return updateNodeInTree(prev, parentId, parent => ({
          ...parent,
          children: [...(parent.children || []), newFile],
        }))
      }
      // 否则添加到根目录
      return [...prev, newFile]
    })

    return newFile.id
  }, [])

  // 创建文件夹
  const createFolder = useCallback((name: string, parentId?: string) => {
    const newFolder: FileNode = {
      id: generateId(),
      name,
      type: 'folder',
      children: [],
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setFiles(prev => {
      if (parentId) {
        return updateNodeInTree(prev, parentId, parent => ({
          ...parent,
          children: [...(parent.children || []), newFolder],
        }))
      }
      return [...prev, newFolder]
    })

    return newFolder.id
  }, [])

  // 删除文件或文件夹
  const deleteNode = useCallback((nodeId: string) => {
    setFiles(prev => deleteNodeFromTree(prev, nodeId))
    if (activeFileId === nodeId) {
      setActiveFileId(null)
    }
  }, [activeFileId])

  // 重命名文件或文件夹
  const renameNode = useCallback((nodeId: string, newName: string) => {
    setFiles(prev => 
      updateNodeInTree(prev, nodeId, node => ({
        ...node,
        name: newName,
        updatedAt: new Date(),
      }))
    )
  }, [])

  // 更新文件内容
  const updateFileContent = useCallback((fileId: string, content: string) => {
    setFiles(prev =>
      updateNodeInTree(prev, fileId, node => ({
        ...node,
        content,
        updatedAt: new Date(),
      }))
    )
  }, [])

  // 获取文件内容
  const getFileContent = useCallback((fileId: string): string => {
    const file = findNodeInTree(files, fileId)
    return file?.content || ''
  }, [files])

  // 获取文件信息
  const getFile = useCallback((fileId: string): FileNode | null => {
    return findNodeInTree(files, fileId)
  }, [files])

  return {
    files,
    activeFileId,
    setActiveFileId,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    updateFileContent,
    getFileContent,
    getFile,
  }
}

// 辅助函数：在树中查找节点
function findNodeInTree(nodes: FileNode[], nodeId: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) {
      return node
    }
    if (node.children) {
      const found = findNodeInTree(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

// 辅助函数：更新树中的节点
function updateNodeInTree(
  nodes: FileNode[],
  nodeId: string,
  updater: (node: FileNode) => FileNode
): FileNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) {
      return updater(node)
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeInTree(node.children, nodeId, updater),
      }
    }
    return node
  })
}

// 辅助函数：从树中删除节点
function deleteNodeFromTree(nodes: FileNode[], nodeId: string): FileNode[] {
  return nodes
    .filter(node => node.id !== nodeId)
    .map(node => {
      if (node.children) {
        return {
          ...node,
          children: deleteNodeFromTree(node.children, nodeId),
        }
      }
      return node
    })
}
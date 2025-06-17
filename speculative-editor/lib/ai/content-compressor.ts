import { ContextChunk } from '@/types'

export class ContentCompressor {
  // 将文件内容分解为结构化的chunks
  static compressContent(fileId: string, content: string): ContextChunk[] {
    const chunks: ContextChunk[] = []
    const lines = content.split('\n')
    let currentChunk: string[] = []
    let currentType: ContextChunk['type'] = 'paragraph'
    let currentLevel: number | undefined
    let currentLanguage: string | undefined
    let inCodeBlock = false
    let chunkId = 0

    const flushChunk = () => {
      if (currentChunk.length > 0) {
        chunks.push({
          id: `${fileId}-chunk-${chunkId++}`,
          fileId,
          content: currentChunk.join('\n').trim(),
          type: currentType,
          level: currentLevel,
          language: currentLanguage,
        })
        currentChunk = []
        currentLevel = undefined
        currentLanguage = undefined
      }
    }

    for (const line of lines) {
      // 检测代码块
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          flushChunk()
          inCodeBlock = true
          currentType = 'code'
          currentLanguage = line.slice(3).trim() || 'plaintext'
        } else {
          inCodeBlock = false
          flushChunk()
          currentType = 'paragraph'
        }
        continue
      }

      if (inCodeBlock) {
        currentChunk.push(line)
        continue
      }

      // 检测标题
      const headingMatch = line.match(/^(#{1,3})\s+(.+)/)
      if (headingMatch) {
        flushChunk()
        currentType = 'heading'
        currentLevel = headingMatch[1].length
        currentChunk.push(headingMatch[2])
        flushChunk()
        currentType = 'paragraph'
        continue
      }

      // 检测列表
      if (line.match(/^[\-\*]\s+/)) {
        if (currentType !== 'list') {
          flushChunk()
          currentType = 'list'
        }
        currentChunk.push(line)
        continue
      }

      // 空行分隔段落
      if (line.trim() === '') {
        flushChunk()
        currentType = 'paragraph'
        continue
      }

      // 普通段落
      if (currentType !== 'paragraph') {
        flushChunk()
        currentType = 'paragraph'
      }
      currentChunk.push(line)
    }

    flushChunk()
    return chunks
  }

  // 获取chunk的摘要
  static summarizeChunk(chunk: ContextChunk): string {
    const maxLength = 100
    if (chunk.content.length <= maxLength) {
      return chunk.content
    }

    switch (chunk.type) {
      case 'heading':
        return chunk.content
      case 'code':
        const lines = chunk.content.split('\n')
        return `${chunk.language} code block (${lines.length} lines)`
      case 'list':
        const items = chunk.content.split('\n').length
        return `List with ${items} items`
      default:
        return chunk.content.substring(0, maxLength) + '...'
    }
  }

  // 计算chunk之间的相关性
  static calculateRelevance(chunk1: ContextChunk, chunk2: ContextChunk): number {
    // 简单的相关性计算，实际应用中可以使用更复杂的算法
    if (chunk1.type === chunk2.type) {
      return 0.5
    }
    if (chunk1.fileId === chunk2.fileId) {
      return 0.3
    }
    return 0.1
  }
}
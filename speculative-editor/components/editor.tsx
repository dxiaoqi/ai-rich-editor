'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Prediction, EditorState, UserAction } from '@/types'
import { PredictionEngine } from '@/lib/ai/prediction-engine'
import { cn } from '@/lib/utils/cn'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  fileId: string
}

export function Editor({ content, onChange, fileId }: EditorProps) {
  const [editorState, setEditorState] = useState<EditorState>({
    activeFileId: fileId,
    content,
    cursorPosition: 0,
    selection: null,
  })
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [showPrediction, setShowPrediction] = useState(false)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const predictionEngineRef = useRef(new PredictionEngine())
  const lastActionTimeRef = useRef(Date.now())

  // 更新内容时同步编辑器状态
  useEffect(() => {
    setEditorState(prev => ({
      ...prev,
      content,
      activeFileId: fileId,
    }))
    // 更新AI上下文
    predictionEngineRef.current.updateContext(fileId, content)
  }, [content, fileId])

  // 处理文本变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    const cursorPosition = e.target.selectionStart

    // 记录用户操作
    const action: UserAction = {
      type: newContent.length > content.length ? 'insert' : 'delete',
      timestamp: Date.now(),
      position: cursorPosition,
      content: newContent.length > content.length 
        ? newContent.substring(content.length) 
        : undefined,
    }
    predictionEngineRef.current.recordAction(action)

    // 更新内容
    onChange(newContent)
    setEditorState(prev => ({
      ...prev,
      content: newContent,
      cursorPosition,
    }))

    // 触发预测
    triggerPrediction(newContent, cursorPosition)
  }, [content, onChange])

  // 处理选择变化
  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd

    if (start !== end) {
      setEditorState(prev => ({
        ...prev,
        selection: { start, end },
      }))

      // 记录选择操作
      predictionEngineRef.current.recordAction({
        type: 'select',
        timestamp: Date.now(),
        position: start,
      })
    } else {
      setEditorState(prev => ({
        ...prev,
        selection: null,
        cursorPosition: start,
      }))
    }
  }, [])

  // 触发预测
  const triggerPrediction = useCallback(async (content: string, cursorPosition: number) => {
    // 防抖处理
    const now = Date.now()
    if (now - lastActionTimeRef.current < 300) {
      return
    }
    lastActionTimeRef.current = now

    // 生成预测
    const newPrediction = await predictionEngineRef.current.generatePrediction(
      {
        ...editorState,
        content,
        cursorPosition,
      },
      '' // API key would go here in production
    )

    if (newPrediction) {
      setPrediction(newPrediction)
      setShowPrediction(true)
    }
  }, [editorState])

  // 处理Tab键接受预测
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && showPrediction && prediction) {
      e.preventDefault()
      acceptPrediction()
    } else if (e.key === 'Escape' && showPrediction) {
      e.preventDefault()
      setShowPrediction(false)
    }
  }, [showPrediction, prediction])

  // 接受预测
  const acceptPrediction = useCallback(() => {
    if (!prediction || !textareaRef.current) return

    let newContent = content
    const { start, end } = prediction.position

    switch (prediction.type) {
      case 'expand':
        newContent = content.slice(0, start) + prediction.content + content.slice(end)
        break
      case 'replace':
        newContent = content.slice(0, start) + prediction.content + content.slice(end)
        break
      case 'delete':
        newContent = content.slice(0, start) + content.slice(end)
        break
    }

    onChange(newContent)
    setShowPrediction(false)
    setPrediction(null)

    // 设置光标位置
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + prediction.content.length
        textareaRef.current.selectionStart = newCursorPos
        textareaRef.current.selectionEnd = newCursorPos
        textareaRef.current.focus()
      }
    }, 0)
  }, [content, prediction, onChange])

  // 渲染预测提示
  const renderPrediction = () => {
    if (!showPrediction || !prediction) return null

    const lines = content.split('\n')
    const beforeContent = content.substring(0, prediction.position.start)
    const linesBefore = beforeContent.split('\n')
    const currentLine = linesBefore.length - 1
    const columnPosition = linesBefore[linesBefore.length - 1].length

    return (
      <div
        className="absolute pointer-events-none"
        style={{
          top: `${currentLine * 1.5}em`,
          left: `${columnPosition}ch`,
        }}
      >
        <span className="prediction-text prediction-highlight">
          {prediction.content}
        </span>
        <span className="ml-2 text-xs text-muted-foreground">
          Tab to accept
        </span>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleChange}
        onSelect={handleSelect}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-full w-full resize-none bg-background p-4",
          "font-mono text-sm leading-relaxed",
          "focus:outline-none",
          "selection:bg-primary/20"
        )}
        placeholder="Start typing..."
        spellCheck={false}
      />
      {renderPrediction()}
    </div>
  )
}
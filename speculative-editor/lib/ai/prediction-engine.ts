import { Prediction, EditorState, UserAction, BackgroundContext } from '@/types'
import { PromptBuilder } from './prompt-builder'
import { ContentCompressor } from './content-compressor'

export class PredictionEngine {
  private userActions: UserAction[] = []
  private backgroundContext: BackgroundContext = {
    chunks: [],
    relevanceScore: 0,
    timestamp: Date.now(),
  }

  // 记录用户操作
  recordAction(action: UserAction): void {
    this.userActions.push(action)
    // 只保留最近100个操作
    if (this.userActions.length > 100) {
      this.userActions = this.userActions.slice(-100)
    }
  }

  // 更新背景上下文
  updateContext(fileId: string, content: string): void {
    const chunks = ContentCompressor.compressContent(fileId, content)
    this.backgroundContext = {
      chunks,
      relevanceScore: 1.0,
      timestamp: Date.now(),
    }
  }

  // 生成预测
  async generatePrediction(
    editorState: EditorState,
    apiKey: string
  ): Promise<Prediction | null> {
    try {
      // 决定预测类型
      const predictionType = this.decidePredictionType(editorState)
      if (!predictionType) return null

      // 构建prompt
      const prompt = PromptBuilder.buildPrompt(
        predictionType,
        editorState,
        this.userActions.slice(-10), // 最近10个操作
        this.backgroundContext
      )

      // 调用AI API（这里使用模拟响应，实际应用中需要真实的API调用）
      const prediction = await this.callAI(prompt, predictionType, editorState, apiKey)
      
      return prediction
    } catch (error) {
      console.error('Prediction generation failed:', error)
      return null
    }
  }

  private decidePredictionType(
    editorState: EditorState
  ): 'expand' | 'replace' | 'delete' | null {
    // 如果有选中文本，优先考虑替换
    if (editorState.selection) {
      return 'replace'
    }

    // 分析最近的操作来决定预测类型
    const recentActions = this.userActions.slice(-5)
    const deleteCount = recentActions.filter(a => a.type === 'delete').length
    const insertCount = recentActions.filter(a => a.type === 'insert').length

    // 如果最近主要是删除操作，预测删除
    if (deleteCount > insertCount * 2) {
      return 'delete'
    }

    // 默认预测扩展
    return 'expand'
  }

  private async callAI(
    prompt: { system: string; user: string },
    type: 'expand' | 'replace' | 'delete',
    editorState: EditorState,
    apiKey: string
  ): Promise<Prediction> {
    // 模拟AI响应，实际应用中应该调用真实的API
    // 这里简单返回一个示例预测
    const mockPredictions: Record<string, Prediction> = {
      expand: {
        type: 'expand',
        content: ' and continue writing...',
        position: {
          start: editorState.cursorPosition,
          end: editorState.cursorPosition,
        },
        confidence: 0.8,
      },
      replace: {
        type: 'replace',
        content: 'improved text',
        position: editorState.selection || {
          start: editorState.cursorPosition,
          end: editorState.cursorPosition,
        },
        confidence: 0.7,
      },
      delete: {
        type: 'delete',
        content: '',
        position: {
          start: Math.max(0, editorState.cursorPosition - 10),
          end: editorState.cursorPosition,
        },
        confidence: 0.6,
      },
    }

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 100))

    return mockPredictions[type]
  }

  // 清除历史记录
  clearHistory(): void {
    this.userActions = []
  }

  // 获取操作历史
  getActionHistory(): UserAction[] {
    return [...this.userActions]
  }
}
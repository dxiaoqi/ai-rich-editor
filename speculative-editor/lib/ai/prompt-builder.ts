import { UserAction, BackgroundContext, EditorState, ContextChunk } from '@/types'

export interface PromptTemplate {
  system: string
  user: string
  examples?: Array<{
    input: string
    output: string
  }>
}

export class PromptBuilder {
  private static templates: Record<string, PromptTemplate> = {
    expand: {
      system: `You are an AI writing assistant that predicts text expansions.
Given the current text, cursor position, and recent user actions, predict what the user might want to write next.
Focus on natural continuations that match the writing style and context.`,
      user: `Current text: {content}
Cursor position: {cursor}
Recent actions: {actions}
Context: {context}

Predict the next text expansion.`,
    },
    replace: {
      system: `You are an AI writing assistant that predicts text replacements.
Given the selected text and context, predict what the user might want to replace it with.`,
      user: `Selected text: {selection}
Full content: {content}
Context: {context}

Suggest a replacement.`,
    },
    delete: {
      system: `You are an AI writing assistant that predicts text deletions.
Given the current text and user behavior, predict what text the user might want to delete.`,
      user: `Current text: {content}
Cursor position: {cursor}
Recent actions: {actions}

Identify text to delete.`,
    },
  }

  static buildPrompt(
    type: 'expand' | 'replace' | 'delete',
    editorState: EditorState,
    recentActions: UserAction[],
    context: BackgroundContext
  ): { system: string; user: string } {
    const template = this.templates[type]
    if (!template) {
      throw new Error(`Unknown prompt type: ${type}`)
    }

    const contextSummary = this.summarizeContext(context)
    const actionsSummary = this.summarizeActions(recentActions)

    let userPrompt = template.user
      .replace('{content}', editorState.content)
      .replace('{cursor}', editorState.cursorPosition.toString())
      .replace('{actions}', actionsSummary)
      .replace('{context}', contextSummary)

    if (editorState.selection) {
      const selectedText = editorState.content.substring(
        editorState.selection.start,
        editorState.selection.end
      )
      userPrompt = userPrompt.replace('{selection}', selectedText)
    }

    return {
      system: template.system,
      user: userPrompt,
    }
  }

  private static summarizeContext(context: BackgroundContext): string {
    if (context.chunks.length === 0) {
      return 'No additional context available.'
    }

    const summaries = context.chunks
      .slice(0, 3) // 只取最相关的3个chunks
      .map((chunk) => this.summarizeChunk(chunk))
      .join('\n')

    return `Related content:\n${summaries}`
  }

  private static summarizeChunk(chunk: ContextChunk): string {
    switch (chunk.type) {
      case 'heading':
        return `- ${chunk.level ? '#'.repeat(chunk.level) : ''} ${chunk.content}`
      case 'code':
        return `- Code block (${chunk.language}): ${chunk.content.split('\n')[0]}...`
      case 'list':
        return `- List: ${chunk.content.split('\n')[0]}...`
      default:
        return `- ${chunk.content.substring(0, 50)}...`
    }
  }

  private static summarizeActions(actions: UserAction[]): string {
    if (actions.length === 0) {
      return 'No recent actions.'
    }

    const recentActions = actions.slice(-5) // 最近5个操作
    const summaries = recentActions.map((action) => {
      switch (action.type) {
        case 'insert':
          return `Inserted "${action.content}" at position ${action.position}`
        case 'delete':
          return `Deleted text at position ${action.position}`
        case 'select':
          return `Selected text at position ${action.position}`
        case 'cursor-move':
          return `Moved cursor to position ${action.position}`
        default:
          return `Unknown action at position ${action.position}`
      }
    })

    return summaries.join('\n')
  }

  // 添加自定义prompt模板
  static addTemplate(name: string, template: PromptTemplate): void {
    this.templates[name] = template
  }

  // 获取所有可用的模板
  static getTemplates(): string[] {
    return Object.keys(this.templates)
  }
}
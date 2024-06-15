"use client";

import React, { useMemo } from "react";
import { useAIState } from '@/hooks/useAIState'
import { EditorContext } from '@/app/context/EditorContext'
import {ScrollShadow, Tab, Tabs} from "@nextui-org/react";
import { cn } from "@/app/utils/cn";
import Conversation from "../conversation";
import PromptInputWithBottomActions from '../prompt-input-with-botton-actions'

export default function Component({
  className,
  scrollShadowClassname,
}: {
  className?: string;
  scrollShadowClassname?: string;
}) {
  const aiState = useAIState();
    const providerValue = useMemo(() => {
    return {
      isAiLoading: aiState.isAiLoading,
      aiError: aiState.aiError,
      setIsAiLoading: aiState.setIsAiLoading,
      setAiError: aiState.setAiError,
    }
  }, [aiState])
  return (
  <EditorContext.Provider value={providerValue}>
    <div className={cn("flex h-full w-full max-w-full flex-col gap-8", className)}>
      {/* <div className="flex w-full flex-wrap items-center justify-center gap-2 border-b-small border-divider pb-2 sm:justify-between">
        <p className="text-base font-medium">Creative Uses for Kids&apos; Art</p>
        <Tabs className="justify-center">
          <Tab key="creative" title="Creative" />
          <Tab key="technical" title="Technical" />
          <Tab key="precise" title="Precise" />
        </Tabs>
      </div> */}
      <ScrollShadow className={cn("flex h-full flex-col", scrollShadowClassname)}>
        <Conversation />
      </ScrollShadow>
      <div className="flex flex-col gap-2">
        <PromptInputWithBottomActions />
        <p className="px-2 text-tiny text-default-400">
          Rich AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
    </EditorContext.Provider>
  );
}

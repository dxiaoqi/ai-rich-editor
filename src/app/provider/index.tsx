// app/providers.tsx

import {NextUIProvider} from '@nextui-org/react'
import { MessageContextProvider } from '../context/message'
import { ModelContextProvider } from '../context/model'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ModelContextProvider>
        <MessageContextProvider>
          {children}
        </MessageContextProvider>
      </ModelContextProvider>
    </NextUIProvider>
  )
}
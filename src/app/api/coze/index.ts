import { createHistoryPrompt } from '@/prompt';

const COZE_URL = 'https://api.coze.cn/open_api/v2/chat';
const CONVERSATION_ID = '123';
export const postCozeData = async (query: any, doc: string) => {
  const data = {
    conversation_id: CONVERSATION_ID,
    bot_id: process.env.NEXT_PUBLIC_COZE_BOT_ID,
    user: '29032201862555',
    query: `${query}`,
    chat_history: createHistoryPrompt(doc),
    stream: false,
  };
  const response = await fetch(COZE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_COZE_API_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
      Host: 'api.coze.cn',
      Connection: 'keep-alive',
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
};

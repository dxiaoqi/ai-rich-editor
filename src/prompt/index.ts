const createReqPrompt = () => {
  // 创建基于doc的文本
};

const command = {
  insert: '如果是需要创建的内容',
};
export const createHistoryPrompt = (doc: string) => {
  //创建历史上下文
  return [
    {
      role: 'user',
      content: doc,
      content_type: 'text',
    },
  ];
};

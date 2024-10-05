// 定义接口
export type UrlRecord = {
  id?: number;
  copiedUrl: string;
  domain: string;
  timestamp: number;
};

export type AddDataParams = {
  copiedUrl: string;
  domain: string;
};

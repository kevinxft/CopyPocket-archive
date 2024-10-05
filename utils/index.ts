import { Actions } from "@/types/const";
import { getAllData, addData, clearData } from "./db";
import { UrlRecord } from "@/types";

export const getDomain = async (): Promise<string> => {
  try {
    const url = await getCurrentTabUrl();
    const parsedUrl = new URL(url);
    return parsedUrl.hostname; // 返回域名部分
  } catch (error) {
    console.error("无效的网址:", error);
    return "";
  }
};

export const getCurrentTabUrl = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0]; // 获取当前活动的标签页
      const currentUrl = currentTab.url; // 获取当前标签页的 URL
      console.log("当前标签页的 URL:", currentUrl);
      resolve(currentUrl ?? "");
    });
  });
};

export const saveLink = async (copiedUrl: string) => {
  const domain = await getDomain();
  addData({ copiedUrl, domain });
};

// 监听来自插件页面的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === Actions.getData) {
    getAllData(message.domain)
      .then((data) => {
        sendResponse(data);
      })
      .catch(() => {
        sendResponse([]);
      });
    return true; // 保持消息通道开放以进行异步响应
  } else if (message.action === Actions.clearData) {
    clearData(message.domain)
      .then(() => {
        sendResponse();
      })
      .catch(() => {
        sendResponse();
      });
    return true;
  }
});

export function getCurrentTabId(): Promise<number> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        return resolve(-1);
      }

      if (tabs.length > 0) {
        const currentTabId = tabs[0].id; // 获取当前活动选项卡的 ID
        if (currentTabId) {
          resolve(currentTabId);
          return;
        }
      }
      resolve(-1);
    });
  });
}

export const copiedUrlToClipboard = async (urls: UrlRecord[]) => {
  const copiedUrls = urls.map((url) => url.copiedUrl);
  const text = copiedUrls.join("\n").trim();
  if (text) {
    await copyToClipboard(text);
  }
};

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    console.log("复制成功:", text);
  } catch (err) {
    console.error("无法复制到剪切板:", err);
  }
}

export function sendMessageToBackground(message: any): Promise<UrlRecord[]> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
  });
}

import { UrlRecord } from "@/types";
import { Actions } from "@/types/const";
import { useState } from "react";
import { getDomain, sendMessageToBackground } from "@/utils";

// 发送消息到 background 脚本

function App() {
  const [urls, setUrls] = useState<UrlRecord[]>([]);

  const onGetData = async () => {
    const res = await sendMessageToBackground({ action: Actions.getData });
    if (res) {
      setUrls(res);
      return res;
    }
    return [];
  };

  useEffect(() => {
    onGetData();
  }, []);

  const onCopyAll = async () => {
    const res = await onGetData();
    console.warn("allData: ", res);
    copiedUrlToClipboard(res);
  };

  const onCopyCurrentTab = async () => {
    const domain = await getDomain();
    const res = await sendMessageToBackground({
      action: Actions.getData,
      domain,
    });
    console.log("currentData: ", res);
    copiedUrlToClipboard(res);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className="text-sm">一共: {urls.length} 条数据</div>
      <button onClick={onCopyAll}>复制全部链接🔗</button>
      <button onClick={onCopyCurrentTab}>复制当前标签页复制的链接🔗</button>
    </div>
  );
}

export default App;

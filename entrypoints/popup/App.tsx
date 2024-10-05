import { UrlRecord } from "@/types";
import { Actions } from "@/types/const";
import { useState } from "react";
import {
  getDomain,
  sendMessageToBackground,
  copiedUrlToClipboard,
} from "@/utils";

// 发送消息到 background 脚本

function App() {
  const [urls, setUrls] = useState<UrlRecord[]>([]);
  const [domain, setDomain] = useState("");

  const onGetData = async () => {
    console.warn("onGetData");
    const res = await sendMessageToBackground({ action: Actions.getData });
    console.warn("res: ", res);
    if (res) {
      setUrls(res);
      return res;
    }
    return [];
  };

  useEffect(() => {
    onGetData();
    getDomain().then((res) => {
      setDomain(res);
    });
  }, []);

  const onCopyAll = async () => {
    const res = await onGetData();
    await copiedUrlToClipboard(res);
  };

  const onCopyCurrentTab = async () => {
    const res = await sendMessageToBackground({
      action: Actions.getData,
      domain,
    });
    await copiedUrlToClipboard(res);
  };

  const onCutCurrentTab = async () => {
    await onCopyCurrentTab();
    await sendMessageToBackground({
      action: Actions.clearData,
      domain,
    });
    await onGetData();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className="text-sm">一共: {urls.length} 条数据</div>
      <button onClick={onCopyAll}>复制全部链接🔗</button>
      <button onClick={onCopyCurrentTab}>复制当前标签页复制的链接🔗</button>
      <button onClick={onCutCurrentTab}>
        剪切当前标签页复制的链接🔗(会清空数据)
      </button>
    </div>
  );
}

export default App;

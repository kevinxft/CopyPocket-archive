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
    const res = await sendMessageToBackground({ action: Actions.getData });
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
    <div className="flex flex-col items-center gap-3 p-4 w-[200px] rounded-lg">
      <div className="text-sm">一共: {urls.length} 条数据</div>
      <div className="flex gap-3">
        <button
          className="bg-sky-500 text-white rounded-md py-2 px-4 hover:bg-sky-500/80 active:bg-sky-600"
          onClick={onCopyAll}
        >
          复制
        </button>
        <button
          className="bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-500/80 active:bg-sky-600"
          onClick={onCutCurrentTab}
        >
          剪切
        </button>
      </div>
    </div>
  );
}

export default App;

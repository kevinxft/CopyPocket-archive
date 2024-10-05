import { MemuId } from "@/types/const";
import { saveLink } from "@/utils";

export default defineBackground(() => {
  chrome.contextMenus.create({
    id: MemuId,
    title: "保存到CopyPocker",
    contexts: ["link"],
  });

  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === MemuId) {
      const link = info.linkUrl;
      if (link) {
        await saveLink(link);
      }
    }
  });
});

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  chrome.contextMenus.create({
    id: "SaveToCopySaver",
    title: "保存到CopySaver",
    contexts: ["link", "selection"],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "copyToSaver") {
      console.log("复制到 Saver 被点击");
      console.log("链接地址:", info.linkUrl);
      console.log("选中的文本:", info.selectionText);
    }
  });
});

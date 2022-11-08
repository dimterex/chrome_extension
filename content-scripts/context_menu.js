var actions = {
    "change_document_status": {
        title: "Set document status",
        scritps: ["progress", "review", "rework", "hold", "estimate", "done", "postponed", "obsolete"]
    },
    "change_qna_status": {
        title: "Set QNA status",
        scritps: ["new", "progress", "answered", "done", "stuck"]
    }
}

for(var key in actions) {
    let value = actions[key];

    chrome.contextMenus.create({
        id: key,
        title: value.title,
        type: "normal",
        contexts: ["selection", "editable"]
    });

    for(var subitems in value.scritps) {
        let item = value.scritps[subitems];
         chrome.contextMenus.create({
            id: key + subitems,
            title: item,
            parentId: key,
            type: "normal",
            contexts: ["selection", "editable"]
        });
    }
}

chrome.contextMenus.onClicked.addListener((info) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        for(var key in actions) {
            let value = actions[key];

            for(var subitems in value.scritps) {
                let item_key = key + subitems;

                if (item_key === info.menuItemId)
                {
                    let script = value.scritps[subitems];
                    let currentTabId = tabs[0].id;
                    chrome.tabs.sendMessage(currentTabId, { id: key, action: script });
                    return;
                }
            }
        }
    });
});


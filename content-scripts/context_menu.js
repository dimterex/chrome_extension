var actions = {
    "change_document_status": {
        title: "Set document status",
        scritps: {
            "progress": "progress",
            "review": "review",
            "rework": "rework",
            "hold": "hold",
            "estimate": "estimate",
            "done": "done",
            "postponed": "postponed",
            "obsolete": "obsolete"
        },
        contexts: ["selection", "editable"],
    },
    "change_qna_status": {
        title: "Set QNA status",
        scritps: {
            "new": "new",
            "progress": "progress",
            "answered": "answered",
            "done": "done",
            "stuck": "stuck"
        },
        contexts: ["selection", "editable"],
    },
    "ant_designer_table": {
        title: "Change table",
        scritps: {
            "remove_cell": "Удалить колонку",
            "insert_cell": "Вставть колонку в конец",
            "copy_cell": "Дублировать колонку",
            "remove_row": "Удалить строку",
            "add_row": "Дублировать строку",
        },
        contexts: ["selection", "editable", "page"],
    }
}

for(var key in actions) {
    let value = actions[key];

    chrome.contextMenus.create({
        id: key,
        title: value.title,
        type: "normal",
        contexts: value.contexts
    });

    for (var subitems in value.scritps) {
        let item = value.scritps[subitems];
         chrome.contextMenus.create({
            id: key + subitems,
            title: item,
            parentId: key,
            type: "normal",
            contexts: value.contexts
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
                    let currentTabId = tabs[0].id;
                    chrome.tabs.sendMessage(currentTabId, { id: key, action: subitems });
                    return;
                }
            }
        }
    });
});

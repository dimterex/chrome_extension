let actions = {
    "change_document_status": {
        title: "Set document status",
        scripts: {
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
        scripts: {
            "new": "new",
            "progress": "progress",
            "answered": "answered",
            "done": "done",
            "stuck": "stuck"
        },
        contexts: ["selection", "editable"],
    },
    "tables": {
        title: "Редактирование таблиц",
        submenu_items: {
            "rows": {
                title: "Строки",
                scripts: {
                    "remove": "Удалить",
                    "clone": "Дублировать"
                }
            },
            "columns": {
                title: "Колонки",
                scripts: {
                    "remove": "Удалить ",
                    "insert": "Вставть в конец",
                    "clone": "Дублировать",
                    "clear": "Очистить"
                },
            },
            "cells": {
                title: "Ячейки",
                scripts: {
                    "copy": "Скопирвоать",
                    "paste": "Вставить",
                    "clear": "Очистить"
                }
            }
        },
        contexts: ["selection", "editable", "page"],
    },
    "elements": {
        title: "Редактирование элементов",
        scripts: {
            "copy": "Скопирвоать",
            "paste": "Вставить",
            "clear": "Очистить"
        },
        contexts: ["selection", "editable", "page"],
    },
    "common": {
        title: "Общее",
        scripts: {
            "save_changes": "Сохранить изменения"
        },
        contexts: ["selection", "editable", "page"],
    }
}

let action_keys = {}

for(var key in actions) {
    let value = actions[key];

    chrome.contextMenus.create({
        id: key,
        title: value.title,
        type: "normal",
        contexts: value.contexts
    });

    if (value.scripts)
        create_menu_item(value.scripts, key, null, value.contexts);

    if (value.submenu_items)
        create_submenu(value.submenu_items, key, value.contexts);
}

function create_menu_item(scripts, root_key, action_key, contexts) {
    for (var subitems in scripts) {
        let item = scripts[subitems];

        let subkey = root_key + "_" + subitems;
         chrome.contextMenus.create({
            id: subkey,
            title: item,
            parentId: root_key,
            type: "normal",
            contexts: contexts
        });

        if (action_key) {
            action_keys[subkey] = action_key + "_" + subitems;
        } else {
            action_keys[subkey] = subitems;
        }
    }
}

function create_submenu(submenu_items, parent_key, contexts) {
    for (var submenu in submenu_items) {
        let item = submenu_items[submenu];
        let subkey = parent_key + "_" + submenu;

        chrome.contextMenus.create({
            id: subkey,
            title: item.title,
            parentId: parent_key,
            type: "normal",
            contexts: contexts
        });

        if (item.scripts)
            create_menu_item(item.scripts, subkey, submenu, contexts);
    }
}

chrome.contextMenus.onClicked.addListener((info) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        for(var key in action_keys) {
            if (key == info.menuItemId){
                chrome.tabs.sendMessage(tabs[0].id, { 
                    id: key,
                    action: action_keys[key],
                });
                return;
            }
        }
    });
});

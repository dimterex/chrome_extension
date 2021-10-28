(function() {
    "use strict";

    let stateAllTabs = false;

    function muteCurrentTab() {
        // chrome.tabs.getCurrent(function(tab) {
        //     chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
        // });

        var query = { active: true, currentWindow: true };
        chrome.tabs.query(query, function callback(tabs) {
          var currentTab = tabs[0]; // there will be only one in this array
          console.log(currentTab); // also has properties like currentTab.id
        });
    }

   function muteAllTabs() {
        stateAllTabs = !stateAllTabs;
        chrome.windows.getAll({populate: true}, windowList => {
            windowList.forEach(window => {
                window.tabs.forEach(tab => {
                    if (tab.audible || tab.mutedInfo.muted) {
                        chrome.tabs.update(tab.id, {muted: stateAllTabs});
                    }
                });
            });
        });
    }

    function muteAllTabsExceptCurrent() {
        chrome.windows.getAll({populate: true}, windowList => {
            windowList.forEach(window => {
                window.tabs.forEach(tab => {
                    if (tab.audible) {
                        chrome.tabs.update(tab.id, {muted: true})
                    }
                });
            });
        });
        chrome.tabs.getSelected(null, tab => {
            chrome.tabs.update(tab.id, {muted: false});
        });
    }

    registerSite(/^https?:\/\/meet.google.com.*$/, [{
        action: "Mute current tab",
        script: muteCurrentTab
    }, {
        action: "Mute all tabs",
        script: muteAllTabs
    }, {
        action: "Mute_tab_all_except_current",
        script: muteAllTabsExceptCurrent
    }]);
})();
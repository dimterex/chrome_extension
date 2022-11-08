var registerSite;

(function(){
    "use strict";

    let ctrButtonsBlock,
        ctrProgressBlock,
        ctrProgressText,
        __sites = [];

    registerSite = function(siteRegex, functions) {
        __sites.push({
            site: siteRegex,
            functions: functions
        });
    }

    function setMessage(message, append) {
        var height;

        ctrButtonsBlock.style.display = message ? 'none' : 'block';
        ctrProgressBlock.style.display = message ? 'block' : 'none';

        if (message) {
            if (append) {
                message = ctrProgressText.innerText + message;
            }
            ctrProgressText.innerText = message;
        }

        height = (message ? ctrProgressBlock : ctrButtonsBlock).clientHeight;
        document.body.style.height = height;
        document.querySelector('html').style.height = height;
    }

    function registerFunction(activeTab, item, callback) {

        let div = document.createElement("div");
        let button = document.createElement("a");
        button.href = "#";
        button.classList = ["btn"];
        button.innerText = item.action;

        div.appendChild(button);
        
        if (item.submenu)
        {
            var dropdown_content = document.createElement("div");
            div.appendChild(dropdown_content);

            div.classList = ["dropdown"];
            dropdown_content.classList = ["dropdown-content"];

             for (let i = 0; i < item.submenu.length; ++i) {
                var submenu = item.submenu[i];
                let submenu_button = document.createElement("a");
                submenu_button.classList = ["btn"];
                submenu_button.innerText = submenu.action;

                submenu_button.addEventListener('click', function(event) {
                    event.preventDefault();
                    injectScript(activeTab, submenu.script);
                });

                dropdown_content.appendChild(submenu_button);
            }
        }
        else
        {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                injectScript(activeTab, item.script);
            });
        }

        ctrButtonsBlock.appendChild(div);
    }

    function injectScript(tab, script) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: script,
          world: "MAIN"
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        ctrButtonsBlock = document.getElementById('buttons-block');
        ctrProgressBlock = document.getElementById('progress-block');
        ctrProgressText = document.getElementById('progress-text');

        setMessage();
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            for (let i = 0; i < __sites.length; ++i) {
                if (__sites[i].site.test(activeTab.url)) {
                    let functions = __sites[i].functions;
                    for (let j = 0; j < functions.length; ++j) {
                        registerFunction(activeTab, functions[j]);
                    }

                    return;
                }
            }

            setMessage("Can't find actions.");
        });
    });
})();

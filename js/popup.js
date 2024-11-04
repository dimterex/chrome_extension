var registerSite;

(function() {
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

    function registerFunction(activeTab, item) {
        let div = document.createElement("div");
        let button = document.createElement("a");
        button.href = "#";
        button.classList = ["btn"];
        button.innerText = item.action;

        div.appendChild(button);
        
        button.addEventListener('click', function(event) {
            event.preventDefault();
            injectScript(activeTab, item.script);
        });

        ctrButtonsBlock.appendChild(div);
    }

    function injectScript(tab, script) {
        console.log(script);

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: script,
            world: "MAIN"
          });          
    }

    function injectEventListeners(tab) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                document.addEventListener("open_window", function(event) {
                    console.log(event);
                    if (event.type) {
                        switch (event.type) {
                            case "open_window":
                                const header = `<!DOCTYPE html> <html lang="ru"> <head> <meta charset="utf-8"> </head> <body>`;
                                const footer = "</body> </html>";
                                const e = event.detail;
                        
                                const winUrl = URL.createObjectURL(
                                    new Blob([`${header} ${e.text} ${footer}`], { type: "text/html" })
                                );
                        
                                window.open(
                                    winUrl,
                                    e.win_name,
                                    `width=600,height=300,screenX=200,screenY=200`
                                );
                                return;
                            default:
                                return;
                        }
                    }
                });
            },
            world: "MAIN"
          }); 
    }

    document.addEventListener('DOMContentLoaded', function() {
        console.log(document);

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

                    injectEventListeners(activeTab);
                   
                    return;
                }
            }

            setMessage("Can't find actions.");
        });
    });
})();

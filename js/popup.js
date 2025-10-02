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

        height = (message ? ctrProgressBlock : ctrButtonsBlock).height;
        document.body.style.height = height;
        document.querySelector('html').style.height = height;
    }

    function registerFunction(activeTab, item, callback) {
        let div = document.createElement("div");
        let button = document.createElement("a");
        button.href = "#";
        button.classList = ["custom-btn"];
        button.innerText = item.action;
        button.style

        div.appendChild(button);

        button.addEventListener('click', function(event) {
            event.preventDefault();
            injectScript(activeTab, item.script);
            callback();
        });

        ctrButtonsBlock.appendChild(div);

        setMessage();
    }

    function injectScript(tab, script) {
        console.log("injectScript");

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: script,
            world: "MAIN"
          });          
    }

    function injectEventListeners(tab) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (extension_id) =>  {

                function show_notification(message) {
                    var notification = document.createElement("div");
                    notification.id = "notification";
                    notification.style = "display: block; position: fixed; top: 20px; right: 20px; background-color: #333; color: white; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); opacity: 1;";

                    notification.textContent = message;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 3000);
                }

                var extensionUrl = `chrome-extension://${extension_id}`;
                
                document.addEventListener("custom_event", function(event) {
                    const details = event.detail;
                    const event_type = details.event_type;
                    console.log(details);
                    switch (event_type) {
                        case "open_window":
                            
                            const header = `<!DOCTYPE html>
                                <html lang="ru">
                                    <head>
                                        <link rel="stylesheet" type="text/css" href="${extensionUrl}/css/main.css">
                                        <meta charset="utf-8">
                                    </head>
                                    <body>`;
                            const footer = "</body> </html>";

                            const winUrl = URL.createObjectURL(
                                new Blob([`${header} ${details.content} ${footer}`], { type: "text/html" })
                            );

                            window.open(
                                winUrl,
                                details.win_name,
                                `width=600,height=300,screenX=200,screenY=200`
                            );
                            return;
                        
                        case "copy":
                            var copyFrom = document.createElement("textarea");
                            copyFrom.textContent = details.content;
                            document.body.appendChild(copyFrom);
                            copyFrom.select();
                            document.execCommand('copy');
                            copyFrom.blur();
                            document.body.removeChild(copyFrom);
                            show_notification("Скопировано");
                            return;
                           
                        case "notification":
                            show_notification(details.content);
                            return;
                        
                        default:
                            return;
                    }
                });
            },
             args: [chrome.runtime.id],
            world: "MAIN"
          }); 
    }

    document.addEventListener('DOMContentLoaded', function() {
        ctrButtonsBlock = document.getElementById('buttons-block');
        ctrProgressBlock = document.getElementById('progress-block');
        ctrProgressText = document.getElementById('progress-text');
        
         chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            let activeTab = tabs[0];
            console.log(activeTab);
            for (let i = 0; i < __sites.length; ++i) {
                if (__sites[i].site.test(activeTab.url)) {
                    let functions = __sites[i].functions;
                    for (let j = 0; j < functions.length; ++j) {
                        registerFunction(activeTab, functions[j], () =>  { window.close(); });
                    }

                    injectEventListeners(activeTab);
                
                    return;
                }
            }

            setMessage("Can't find actions.");
        });

    });
})();

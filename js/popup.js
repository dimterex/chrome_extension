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

    function helpers() {
        function remove_elements(query) {
            let elemetns = document.querySelectorAll(query);
            for (let element of elemetns)
                element.remove();
        }

        function getStyleSheet(unique_title) {
            for (var i=0; i<document.styleSheets.length; i++) {
                var sheet = document.styleSheets[i];
                if (sheet.title == unique_title)
                      return sheet;
            }
        }

        function remove_all_without_music() {
            remove_elements("div.page_post_sized_thumbs");
            remove_elements("div.page_top");
            remove_elements("h2.page_block_h2");
            remove_elements("div.page_info_wrap");
            remove_elements("div.module");
            remove_elements("div.submit_post_box");
            remove_elements("div.chat_onl_wrap");
            remove_elements("div.narrow_column");
            remove_elements("div.narrow_column_wrap");
            remove_elements("div.side_bar");
            remove_elements("div.footer_wrap");
            remove_elements("div.clear");
            remove_elements("div.wrap_between");
            remove_elements("div.stl_active");
            remove_elements("div.stl_side");
            // remove_elements("div.page_header_cont");
            remove_elements("div.head_nav_item");
            remove_elements("div.ui_actions_menu_wrap");
            remove_elements("div.post_header");
            remove_elements("div.wall_post_text");
            remove_elements("div.like_wrap");
           
            var page_body = document.getElementById('page_body');
            page_body.classList.remove("fl_r"); 
            page_body.style.width = 'auto'; 

            var page_layout = document.getElementById('page_layout');
            page_layout.style.padding = '0';
            page_layout.style.margin = '0';
            page_layout.style.position = 'absolute';
            page_layout.style.width = 'auto'; 
            page_layout.style.background = 'antiquewhite';
            page_layout.style.display = 'contents';


            let elemetns = document.querySelectorAll("div.scroll_fix");
            for (let element of elemetns)
            {
                element.style.position = 'absolute';
                element.style.display = 'contents';
            }
            elemetns = document.querySelectorAll("div.wide_column_wrap");
            for (let element of elemetns)
            {
                element.style.margin = '0';
            } 

            elemetns = document.querySelectorAll("div.wide_column_left");
            for (let element of elemetns)
            {
                element.style.display = 'contents';
                element.style.position = 'absolute';
                element.style.height = 'auto';
                element.style.width = 'auto';
            }
        }
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

    function registerFunction(text, callback) {
        let button = document.createElement("a");

        button.href = "#";
        button.classList = ["btn"];
        button.innerText = text;

        button.addEventListener('click', function(event) {
            event.preventDefault();
            callback();
        });

        ctrButtonsBlock.appendChild(button);
    }

    function getFunctionBody(script) {
        return /[^\n]+\n([\s\S]*)\n[^\n]+/.exec(script.toString())[1];
    }

    function injectScript(tab, script, callback) {
        let injected = "(function(){";

        injected += getFunctionBody(helpers);
        injected += "\n\n";

        if (typeof(script) === "function") {
            injected += getFunctionBody(script);
        } else {
            injected += script;
        }

        injected += "})();";

        chrome.tabs.executeScript(tab.id, { code: injected }, function(results) {
            callback();
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
                        registerFunction(functions[j].action, function() {
                            injectScript(activeTab, functions[j].script, function() {
                                window.close();
                            });
                        });
                    }

                    return;
                }
            }

            setMessage("Sorry, Mario, the princess is in another castle!");
        });
    });
})();

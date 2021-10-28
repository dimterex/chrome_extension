chrome.webNavigation.onCompleted.addListener(function(activeTab) {
    return;
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (tabId == activeTab.tabId){
            injectScript(activeTab, injectDarcStyle);
        }
       
    });
    
    injectScript(activeTab, injectDarcStyle);
}, {url: [{urlMatches : 'https://confluence.'}]});


function injectScript(tab, script) {
    let injected = "(function(){";

    if (typeof(script) === "function") {
        injected += getFunctionBody(script);
    } else {
        injected += script;
    }

    injected += "})();";

    chrome.tabs.executeScript(tab.id, { code: injected });
}

function getFunctionBody(script) {
    return /[^\n]+\n([\s\S]*)\n[^\n]+/.exec(script.toString())[1];
}


function injectDarcStyle() {
    let style = document.createElement('style');
    style.innerText = '' +
   
    /* цвета основного фона */
    'html { ' +
    '    background-color: #282923 !important;' +
    '} ' +
    ' ' +
    'table.confluenceTable td.confluenceTd.highlight-green { ' +
    '    background-color: #2d5440 !important;' +
    '} ' +
    ' ' +
    'body, ' +
    '.aui-page-panel, ' +
    '.aui-label , ' +
    '.acs-side-bar, ' +
    '.space-tools-section, ' +
    '.quick-comment-prompt, ' +
    '#footer-logo, ' +
    '#full-height-container, ' +
    '#main-header.overlay-header, ' +
    '.wiki-content time, ' +
    '.content-header, ' +
    '.aui-sidebar .aui-sidebar-body, ' +
    '.aui-sidebar .aui-sidebar-footer, ' +
    '.spacetools.with-space-sidebar #main-header, ' +
    '.wiki-content a.user-mention, ' +
    '.confluence-information-macro-inf, ' + 
    '.confluence-information-macro, ' +
    'form.aui .text, ' +
    'table.confluenceTable th.confluenceTh ' +
    
    '{ ' +
    '    background-color: #282923 !important;' +
    '    background: #282923 !important;' +
    '} ' +
    ' ' +
    'table.confluenceTable th.confluenceTh.highlight-grey, ' +
    'table.confluenceTable td.confluenceTd.highlight-grey,' +
    '.wiki-content table.tablesorter>thead>tr>th { ' +
    '    background-color: #000;' +
    '} ' +
    ' ' +

     /* цвета текста */

    'body, ' +
    '.list-container a ' +
    
    '{ ' +
    '    color: #c1a84d !important;' +
    '} ' +

    'table.confluenceTable th.confluenceTh > p, ' +
    'table.confluenceTable th.confluenceTh, ' +
    '.wiki-content .tablesorter-header-inner, ' +
    '.wiki-content time ' +
    '{ ' +
    '    color: #c1a84d !important;' +
    '} ' +

    '.wiki-content a, .wiki-content a:link, ' +
    'a:not(.aui-button,.aui-dialog2-header-close), ' +
    '.expand-control-text ' +
    '{ ' +
    '    color: #d6cd92 !important;' +
    '} ' +

    'h1, h2, h3, h4, ' +
    '#title-text a ' +
    '{ ' +
    '    color: #60d8da !important;' +
    '} ' + 

    '.confluence-information-macro ' +
    '{ ' +
    '    color: #60d8da !important;' +
    '} ' + 


    '.acs-side-bar a, ' +
    '.aui-button.aui-button-subtle, ' +
    'form.aui .text, ' +
    '.aui-navgroup-vertical .aui-nav>li>a, ' +
    '.acs-nav-list .acs-nav-item-label ' +
    '{ ' +
    '    color: #589d9e !important;' +
    '} ' + 

    'body.mceContentBody ' +
    '{ ' +
    '    background: #282923 !important;' +
    '} '+


    /* цвета иконок */
    '.confluence-information-macro-icon.aui-iconfont-info ' +
    '{ ' +
    '    color: #007dff !important;' +
    '} ' + 


    '.confluence-information-macro-icon.aui-iconfont-warning ' +
    '{ ' +
    '    color: #ffc30d !important;' +
    '} ';

    document.head.appendChild(style);



    let editor_style = document.querySelector('#wysiwygTextarea_ifr').contentDocument.createElement('style');
    editor_style.innerText = style.innerText;

    document.querySelector('#wysiwygTextarea_ifr').contentDocument.querySelector('body').appendChild(editor_style);
}
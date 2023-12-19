(function() {
    "use strict";

    function openLinkedMerges() {
        var regex = /(?<=browse\/)(\D+\w+)/g;
        var result = location.href.match(regex);
        window.open('http://orpo-gitlab.elcom.local/search?scope=merge_requests&search=' + result);
    }

    function shareToTodoist() {
        const ip = '190.160.1.53';
        const port = 60009;
        var regex = /(?<=browse\/)(\D+\w+)/g;

        const params = {
            issue_id: location.href.match(regex),
            comment: document.getElementById('summary-val').innerText
        };

        const paramString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        console.log(paramString);
        const url = `http://${ip}:${port}/api/configuration/add_new_task?${paramString}`
        const newWindow = window.open(url, "win", `width=100,height=100,screenX=200,screenY=200`);

        setTimeout(() => {
          newWindow.close();
        }, 100)
    }

    function copyForComments() {

        var olElement = document.querySelector('ol.issue-list');
        var liElements = olElement.querySelectorAll('li');
        var url = location.origin + '/browse/'

        let content = [];
        for (var i = 0; i < liElements.length; i++) {
            var liElement = liElements[i];
            var path = url + liElement.getAttribute('data-key');
            var name = liElement.getAttribute('title');
            content.push(path + ": " + name);
        }

        const header = `<!DOCTYPE html> <html> <body>`;
        const footer = "</body> </html>";

        const winUrl = URL.createObjectURL(
            new Blob([`${header} ${content.join("")} ${footer}`], { type: "text/html" })
        );

        const win = window.open(
            winUrl,
            "win",
            `width=600,height=300,screenX=200,screenY=200`
        );
    }

    registerSite(/^https?:\/\/orpo-jira.*$/, [{
        action: "Open MR",
        script: openLinkedMerges
    },{
        action: "Share to Todoist",
        script: shareToTodoist
    },{
        action: "Copy for document",
        script: copyForComments
    }]);
})();

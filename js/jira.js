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
        var url = location.origin + '/browse/';

        let contents = [];
        for (var i = 0; i < liElements.length; i++) {
            var liElement = liElements[i];
            var path = url + liElement.getAttribute('data-key');
            var name = liElement.getAttribute('title');
            content.push(`<div>${path + ": " + name}</div>`);
        }
        var event = new CustomEvent("custom_event", {
            detail: {
                event_type: "open_window",
                content: contents.join(""),
                win_name: "comments",
            }
        });
     
        document.dispatchEvent(event);
    }

    function copyForBacklog() {
        var issue_id = document.querySelector('a.issue-link').getAttribute('data-issue-key');
        var title = document.getElementById('summary-val').innerText;
        var sync_block = document.getElementById('syncpanelinfo-backbone');

        var sync_items = sync_block.querySelectorAll('dl');
        var sync_id = sync_items[0].querySelector('span.view-issue-field').innerText;
        var url = location.origin + '/browse/';

        var event = new CustomEvent("custom_event", {
            detail: {
                event_type: "copy",
                content: `${url}/${issue_id} (ВБИ ${sync_id}) - ${title}`
            }
        });
        document.dispatchEvent(event);
    }

    function removeSuccessSubtask() {
        document.getElementById("show-more-links-link").click()
        let lists = document.querySelectorAll('dl.links-list');

        for (let i in lists) {
            let list = lists[i];
            let title = list.querySelector('dt');
            if (title.getAttribute('title') == 'Подзадачи') {
                let tasks = list.querySelectorAll('dd');
                for (let j in tasks) {
                    let task = tasks[j];
                    let statusElement = task.querySelector('li.status');
                    let status = statusElement.querySelector('span.jira-issue-status-lozenge-done');
                    if (status) {
                        task.remove();
                    }
                }
            }
        }
    }


    registerSite(/^https?:\/\/jira.*$/, [{
        action: "Open MR",
        script: openLinkedMerges
    },{
        action: "Share to Todoist",
        script: shareToTodoist
    },{
        action: "Copy for document",
        script: copyForComments
    },{
        action: "Copy for backlog",
        script: copyForBacklog
    },{
        action: "Remove success subtask",
        script: removeSuccessSubtask
    }]);
})();

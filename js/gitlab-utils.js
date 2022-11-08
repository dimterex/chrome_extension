(function() {
    "use strict";

    function openMrRedmineLinkedTask() {
        const MAX_TABS = 10;
        let title = document.querySelector(".merge-request-details .title").innerText;
        let regex = new RegExp(/(?:#|[Bb]ugfix\/|[Ff]eature\/|[Hh]otfix\/)(\d+)/, 'g');

        for (let i = 0; i < MAX_TABS; ++i) {
            let taskId = regex.exec(title);
            if (taskId === null) {
                break;
            }
            console.log(taskId);
            window.open("https://orpo-redmine/issues/" + taskId[1], 'mr-linked-task-' + i);
        }
    };

     function openMrJiraLinkedTask() {
        const MAX_TABS = 10;
        let title = document.querySelector(".merge-request-details .title").innerText;
        let regex = new RegExp(/(?:#)(\D+\w+)/, 'g');

        console.log(title);

        let taskId = regex.exec(title);
        if (taskId === null) {
            console.log(taskId + " is uncorrect. Try to another regex.");

            regex = new RegExp(/(\D+\w+)/, 'g');
            taskId = regex.exec(title);

            if (taskId === null) {
                console.log(taskId + " is uncorrect.");
                return;
            }
        }

        console.log(taskId);

        window.open("https://orpo-jira.elcom.local/browse/" + taskId[1]);
    };

    function retryBuild() {
        let notesTabButton = document.querySelector(".notes-tab a"),
            note = document.querySelector(".notes-form .note-textarea");

        notesTabButton.click();

        note.value = "Jenkins please retry a build";
        note.dispatchEvent(new Event('input', {}));

        window.scrollBy(0, note.getBoundingClientRect().top);
    };

    function approveMerge() {
        let notesTabButton = document.querySelector(".notes-tab a"),
            note = document.querySelector(".notes-form .note-textarea"),
            like = document.querySelector(".js-awards-block").children[0],
            approveButton = document.querySelector('button[data-qa-selector="approve_button"]');

        notesTabButton.click();

        note.value = "![image](http://orpo-gitlab.elcom.local/smartptt/smartptt/uploads/318637e5be4b51e1a5c6031dde21523b/image.png)";
        note.dispatchEvent(new Event('input', {}));

        let submit = document.querySelector(".js-comment-submit-button");
        submit.click();

        if (like != null && !like.classList.contains('selected')) {
            like.click();
        }

        if (approveButton != null && !approveButton.classList.contains('btn-warning')) {
            approveButton.click();
        }

        window.scrollBy(0, note.getBoundingClientRect().top);
    };

     function waitingForChangesMerge() {
        let notesTabButton = document.querySelector(".notes-tab a"),
            note = document.querySelector(".notes-form .note-textarea");

        notesTabButton.click();

        note.value = "![image](http://orpo-gitlab.elcom.local/smartptt/smartptt/uploads/e730a60ec4636d8640d5de0c3cbf0c07/image.png)";
        note.dispatchEvent(new Event('input', {}));
      
        let submit = document.querySelector(".js-comment-submit-button");
        submit.click();
        window.scrollBy(0, note.getBoundingClientRect().top);
    };

    registerSite(/^https?:\/\/orpo-gitlab.*$/, [{
        action: "Open Redmine Linked Task",
        script: openMrRedmineLinkedTask
     },{
        action: "Open Jira Linked Task",
        script: openMrJiraLinkedTask
    },{
        action: "Retry build",
        script: retryBuild
    },{
        action: "Approve",
        script: approveMerge
    },{
        action: "Waiting for changes",
        script: waitingForChangesMerge
    }]);
})();

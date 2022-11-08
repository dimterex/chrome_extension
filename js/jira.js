(function() {
    "use strict";

    function openLinkedMerges() {
        var regex = /(?<=browse\/)(\D+\w+)/g;
        var result = location.href.match(regex);
        window.open('http://orpo-gitlab.elcom.local/search?scope=merge_requests&search=' + result);
    }

    registerSite(/^https?:\/\/orpo-jira.*$/, [{
        action: "Open MR",
        script: openLinkedMerges
    }]);
})();

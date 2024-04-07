(function() {
    "use strict";

    function removeBlackWindow() {
        const elements = document.querySelectorAll('app-video-switcher');
        for (const element of elements) {
            if (element.textContent.includes("Видео докладчиков не транслируется")) {
                element.remove();
            }
        }
    }

    registerSite(/^https?:\/\/iva*/, [{
        action: "Remove black window",
        script: removeBlackWindow
    }]);
})();

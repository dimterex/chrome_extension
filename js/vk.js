(function() {
    "use strict";

   
    function removeAllWithoutMusic() {
        remove_all_without_music();
        document.addEventListener('DOMNodeInserted', function(e) {
            remove_all_without_music();
        });
    }

    registerSite(/^https?:\/\/vk.*$/, [{
        action: "Show only music",
        script: removeAllWithoutMusic
    }]);
})();

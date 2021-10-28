(function() {
    "use strict";

    function fill_query() {

        var address = location.href;
        var new_address = address.replace("www.kinopoisk.ru", "ww1.flink.su");
        window.open(new_address);
    }

    registerSite(/^https?:\/\/www.kinopoisk.*$/, [{
        action: "Watch this ...",
        script: fill_query
    }]);
})();


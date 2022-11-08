(function() {
    "use strict";

    function gg_query() {
        var address = location.href;
        var new_address = address.replace("www.kinopoisk.ru", "www.kinopoisk.gg");
        window.open(new_address);
    }

     function kk_query() {
        var address = location.href;
        var new_address = address.replace("www.kinopoisk.ru", "www.kinopoiskk.ru");
        window.open(new_address);
    }

    registerSite(/^https?:\/\/www.kinopoisk.*$/, [{
        action: "Watch this ... v1",
        script: gg_query
    },{
        action: "Watch this ... v2",
        script: kk_query
    }]);
})();


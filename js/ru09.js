(function() {
    "use strict";

    function fill_flat_query() {

        var dict = {};
        dict["price[max]"] = 8500;
        dict["otype"] = 1;
        dict["knum[3]"] = "on";
        dict["knum[4]"] = "on";
        dict["knum[5%2B]"] = "on";
        dict["scom[min]"] = 60;
        dict["kv_su[value]"] = 1;
        dict["kv_loggia[1]"] = "on";
        dict["kv_loggia[2]"] = "on";
        dict["mat[1]"] = "on";
        dict["mat[2]"] = "on";
        dict["mat[3]"] = "on";
        dict["mat[6]"] = "on";

        let params = [];
        for(var key in dict) {
          params.push(`${key}=${dict[key]}`);
        }

        let myNewUrl = `https://www.tomsk.ru09.ru/realty/?type=1&${params.join("&")}`;

        window.open(myNewUrl);
    }

      function fill_house_query() {

        var dict = {};
        dict["price[max]"] = 500;
        dict["otype"] = 2;
        // dict["knum[3]"] = "on";
        // dict["knum[4]"] = "on";
        // dict["knum[5%2B]"] = "on";
        // dict["scom[min]"] = 60;
        // dict["kv_su[value]"] = 1;
        // dict["kv_loggia[1]"] = "on";
        // dict["kv_loggia[2]"] = "on";
        // dict["mat[1]"] = "on";
        // dict["mat[2]"] = "on";
        // dict["mat[3]"] = "on";
        // dict["mat[6]"] = "on";
        dict["electricity[value]"] = "on";
        // dict["water[value]"] = "on";
        // dict["heating[value]"] = "on";
        // dict["sanitation[value]"] = "on";

        let params = [];
        for(var key in dict) {
          params.push(`${key}=${dict[key]}`);
        }

        let myNewUrl = `https://www.tomsk.ru09.ru/realty/?type=1&${params.join("&")}`;

        window.open(myNewUrl);
    }

    registerSite(/^https?:\/\/www.tomsk.ru09.*$/, [{
        action: "Search a flat...",
        script: fill_flat_query
    },{
        action: "Search a house...",
        script: fill_house_query
    }]);
})();


(function() {
    "use strict";

   
    function removeAllWithoutImages() {
        var images = document.getElementsByTagName('img');
        var myWindow = window.open('','Images','width=200,height=100');
        var doc = myWindow.document;
        doc.open();

        for (let img of images)
            doc.write(img.outerHTML);
       
        doc.close();
    }

    registerSite(/^https?:\/\/docs.*$/, [{
        action: "Show only images",
        script: removeAllWithoutImages
    }]);
})();

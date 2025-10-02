(function() {
    "use strict";

    function all_platforms_adding() {
       var tables = document.getElementsByClassName('_tabsBar_132tu_1');

       let langs_table = undefined;

       function delay_start(fn) {
            var millisecondsToWait = 500;
            setTimeout(fn, millisecondsToWait);
       }


       for (let i in tables) {
            let table = tables[i];
            if (table.children.length > 8) {
                langs_table = table;
               break;
            }
       }

       if (langs_table == undefined) {
            return;
       }

       var langs = langs_table.getElementsByClassName("_tabsBarItemContainer_132tu_11");

        for (let i in langs) {
            let lang = langs[i];

            let platforms = document.querySelector("div._ffsItemContainer_1lgcf_56");
            let android = platforms.querySelector("#appgallery");
            
            var add_new_version_button = android.querySelector('button._versionAddButton_1lgcf_39');
            add_new_version_button.click();
            // console.log(add_new_version_button);
            // console.log('Добавление input');

            var set_version = function() {
                var inputs = document.querySelector("div._ffsItemContainer_1lgcf_56").querySelector("#appgallery").querySelectorAll('input');
                var input_version = inputs[0];
                if (inputs.length > 0) {
                    input_version = inputs[inputs.length - 1];
                }
                input_version.focus();
                input_version.select();
                console.log(inputs);
                 console.log(input_version);
                

                // <input placeholder="" data-qa="ffs-ffs-second-step-card-item-add-version-input" class="ant-input css-19ci41j" type="text" value="987"></input>

                input_version.removeAttribute('id');
                input_version.value = "98751";
                       input_version.focus();
                input_version.select();
                  console.log(input_version);
                console.log('Изменение input');
              
            };

            
            var apply_version = function() {
                var save_new_version_button = android.getElementsByClassName('anticon-check')[0].parentElement;
                save_new_version_button.click();
                console.log("save_new_version_button", save_new_version_button);
            }
            
            delay_start(set_version);
            // delay_start(apply_version);
            
            break;
       }


        
       
    }

    registerSite(/https?:\/\/.*\.wb.*$/, [{
        action: "Add all platforms",
        script: all_platforms_adding
    }]);
})();

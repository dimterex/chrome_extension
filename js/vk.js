(function() {
    "use strict";

    function removeAllWithoutMusic() {
        function remove_elements(query) {
            let elemetns = document.querySelectorAll(query);
            for (let element of elemetns)
                element.remove();
        }
        function remove_all_without_music() {
            remove_elements("div.page_post_sized_thumbs");
            remove_elements("div.page_top");
            remove_elements("h2.page_block_h2");
            remove_elements("div.page_info_wrap");
            remove_elements("div.module");
            remove_elements("div.submit_post_box");
            remove_elements("div.chat_onl_wrap");
            remove_elements("div.narrow_column");
            remove_elements("div.narrow_column_wrap");
            remove_elements("div.side_bar");
            remove_elements("div.footer_wrap");
            remove_elements("div.clear");
            remove_elements("div.wrap_between");
            remove_elements("div.stl_active");
            remove_elements("div.stl_side");
            remove_elements("div.head_nav_item");
            remove_elements("div.ui_actions_menu_wrap");
            remove_elements("div.post_header");
            remove_elements("div.wall_post_text");
            remove_elements("div.like_wrap");
           
            var page_body = document.getElementById('page_body');
            page_body.classList.remove("fl_r"); 
            page_body.style.width = 'auto'; 

            var page_layout = document.getElementById('page_layout');
            page_layout.style.padding = '0';
            page_layout.style.margin = '0';
            page_layout.style.position = 'absolute';
            page_layout.style.width = 'auto'; 
            page_layout.style.background = 'antiquewhite';
            page_layout.style.display = 'contents';


            let elemetns = document.querySelectorAll("div.scroll_fix");
            for (let element of elemetns)
            {
                element.style.position = 'absolute';
                element.style.display = 'contents';
            }
            elemetns = document.querySelectorAll("div.wide_column_wrap");
            for (let element of elemetns)
            {
                element.style.margin = '0';
            } 

            elemetns = document.querySelectorAll("div.wide_column_left");
            for (let element of elemetns)
            {
                element.style.display = 'contents';
                element.style.position = 'absolute';
                element.style.height = 'auto';
                element.style.width = 'auto';
            }
        }

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

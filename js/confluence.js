(function() {
    "use strict";

    function registerHotkeys() {
        let script = document.createElement('script');
        script.innerText = '(function(){ if (tinyMCE && tinyMCE.activeEditor)  {' +
            'tinyMCE.activeEditor.addShortcut("ctrl+alt+m","monospace","confMonospace");' +
            ' } })();';
        document.body.appendChild(script);
    }

    function changeElement() {

        const MOVABLE_ID = "movable_object_id"
        const DRUGGABLE_ID = "draggable_object_id"

        let inject_style = function () {
            let style = document.createElement('style');
            style.innerText = '' +
           
            '.resizable {'+
            '    position: relative;'+

            '    /* Center the content */'+
            '    align-items: center;'+
            '    justify-content: center;'+

            '    /* Misc */'+
            '    border: 1px solid #cbd5e0;'+
            '}'+
            '.resizer {'+
            '    position: absolute;'+
            '}'+

            '/* Placed at the right side */'+
            '.resizer-r {'+
            '    cursor: col-resize;'+
            '    height: 100%;'+
            '    right: 1px;'+
            '    top: 0;'+
            '    width: 5px;'+
            '}'+

            '/* Placed at the left side */'+
            '.resizer-l {'+
            '    cursor: col-resize;'+
            '    height: 100%;'+
            '    left: 1px;'+
            '    top: 0;'+
            '    width: 5px;'+
            '}';

           
            document.head.appendChild(style);
        }


        let changeElement = function () {
            const ele = document.querySelector('.ic-display-comment-view');
            const movable_div = document.createElement("div");
            movable_div.setAttribute("id", MOVABLE_ID);

            while (ele.childNodes.length > 0) {
                movable_div.appendChild(ele.childNodes[0]);
            }

            const draggable_div = document.createElement("div");
            draggable_div.setAttribute("id", DRUGGABLE_ID);

            draggable_div.appendChild(movable_div);
            ele.appendChild(draggable_div);

            draggable_div.classList.add("resizable");
            let resizer_r = document.createElement('div')
            resizer_r.classList.add("resizer");
            resizer_r.classList.add("resizer-r");
            
            let resizer_l = document.createElement('div')
            resizer_l.classList.add("resizer");
            resizer_l.classList.add("resizer-l");

            draggable_div.appendChild(resizer_r);
            draggable_div.appendChild(resizer_l);
        }


        let inject_scripts = function() {
            let resize_script = document.createElement('script');
            resize_script.innerText = ' var iteration = 0; ' +

            'function resize_script() { ' + 
            "let movable = document.getElementById('" + MOVABLE_ID +"');" +
            "let druggable = document.getElementById('" + DRUGGABLE_ID +"');" +
            "var x = 0; var y = 0;" +
            "var w = 0; var h = 0;" +
            " const mouseDownHandler = function (e) {" +
            "    x = e.clientX;" +
            "    y = e.clientY;" +
            "    document.addEventListener('mousemove', mouseMoveHandler);" +
            "    document.addEventListener('mouseup', mouseUpHandler);" +
            "};" +
            
            "iteration = 0;" +
            "const mouseMoveHandler = function (e) {" +
            "    const styles = window.getComputedStyle(movable);" +
            /*"   How far the mouse has been moved" +*/
            "    const dx = e.clientX - x;" +
            "    const dy = e.clientY - y;" +
            "    x = e.clientX;" +
            "    y = e.clientY;" +

            "    w = parseInt(styles.width, 10);" +
            "    h = parseInt(styles.height, 10);"  +
            "console.log(event);" +
            /*"    // Adjust the dimension of element" +*/
            /*"    console.log('mouseMoveHandler: iteration=' + iteration+'    width=' + druggable.style.width + '    height=' + druggable.style.height);" +
            "    console.log('mouseMoveHandler: iteration=' + iteration+'    dx=' + dx + '    dy=' + dy);" +
            "    console.log('mouseMoveHandler: iteration=' + iteration+'    x=' + x + '    y=' + y + '    w=' + w + '    h=' + h);" +
            */
            "    druggable.style.width = (w + dx) +'px';" +
            "    druggable.style.height = (h + dy) +'px';" +
            /*"   console.log('mouseMoveHandler: iteration=' + iteration+'    width=' + druggable.style.width + '    height=' + druggable.style.height);" +
            "   iteration++;" +*/
            "};" +

            "const mouseUpHandler = function () {" +
            /*"    // Remove the handlers of `mousemove` and `mouseup`" +*/
            "    document.removeEventListener('mousemove', mouseMoveHandler);" +
            "    document.removeEventListener('mouseup', mouseUpHandler);" +
            "};" +
             "const resizers = druggable.querySelectorAll('.resizer');" +

            "[].forEach.call(resizers, function (resizer) {" +
            "    resizer.addEventListener('mousedown', mouseDownHandler);" +
            "});" +
            "}";
            document.body.appendChild(resize_script);


            let script = document.createElement('script');
            script.innerText = "" + 
            "var movable = document.getElementById('" + MOVABLE_ID +"');" +
            "var druggable = document.getElementById('" + DRUGGABLE_ID +"');" +
            "var mousePosition; " + 
            "var offset = [0,0]; " +
            "var isDown = false;" + 

            'function global_drag_script() { ' + 
                "document.addEventListener('mouseup', function() {" +
                /* "   console.log('mouseup = ' + isDown);" + */
                "    isDown = false;" +
                "}, true);" +
                "document.addEventListener('mousemove', function(event) {" +
                "    event.preventDefault();" +
                /* "     console.log('mousemove = ' + isDown);" + */
                "    if (isDown) {" +
                "        mousePosition = {" +
                "            x : event.clientX," +
                "            y : event.clientY" +
                "        };" +
                "        druggable.style.left = (mousePosition.x + offset[0]) + 'px';" +
                "        druggable.style.top  = (mousePosition.y + offset[1]) + 'px';" +
                "    }" +
                "}, true); " +
           '} ' + 

           'function set_drag_position_script() { ' + 
                "let druggable_style_attr = druggable.getAttribute('style');" +
                /*"console.log('set_drag_position_script =' + druggable_style_attr);" + */
                "movable = document.getElementById('" + MOVABLE_ID +"');" +
                "druggable = document.getElementById('" + DRUGGABLE_ID +"');" +
                "druggable.setAttribute('style', druggable_style_attr);" +
                /* "console.log('set_drag_position_script =' + druggable.getAttribute('style'));" + */
           '} ' + 

           'function drag_script() { ' + 
            "movable.addEventListener('mousedown', function(e) {" +
            /*"    console.log('mousedown =' + isDown);" + */
            "    isDown = true;" +
            "    offset = [" +
            "        druggable.offsetLeft - e.clientX," +
            "        druggable.offsetTop - e.clientY" +
            "    ];" +
            "}, true);" +
            "document.addEventListener('mouseup', function() {" +
            /* "   console.log('mouseup = ' + isDown);" + */
            "    isDown = false;" +
            "}, true);" +
            "document.addEventListener('mousemove', function(event) {" +
            "    event.preventDefault();" +
            /* "     console.log('mousemove = ' + isDown);" + */
            "    if (isDown) {" +
            "        mousePosition = {" +
            "            x : event.clientX," +
            "            y : event.clientY" +
            "        };" +
            "        druggable.style.left = (mousePosition.x + offset[0]) + 'px';" +
            "        druggable.style.top  = (mousePosition.y + offset[1]) + 'px';" +
            "    }" +
            "}, true); " +
            "}";
            document.body.appendChild(script);
        }

        inject_style();
        changeElement();
        inject_scripts();

        let call_function_to_apply = function () {

            let script = document.createElement('script');
            script.innerText = '(function() { ' + 
                "global_drag_script();" +
                "drag_script();" +
                "resize_script();" +
            "})();";
            document.body.appendChild(script);

        }
        call_function_to_apply();

        document.addEventListener('DOMNodeInserted', function(e) {
            if (!e.target.classList.contains("ic-display-comment-view"))
                return;
            changeElement();
            let script = document.createElement('script');
            script.innerText = '(function() { ' + 
                "set_drag_position_script();" +
                "drag_script();" +
                "resize_script();" +
            "})();";
            document.body.appendChild(script);
            console.log(e.target);
        });
    }

    registerSite(/^https?:\/\/confluence.*$/, [{
        action: "Enabled Hotkeys",
        script: registerHotkeys
    },{
        action: "Show comments readable",
        script: changeElement
    }]);
})();

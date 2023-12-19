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
            "var isLeftSide = false;" +
            " const mouseDownHandler = function (e) {" +
            "    x = e.clientX;" +
            "    y = e.clientY;" +
            "    isLeftSide = e.target.classList.contains('resizer-l');" +
            "    document.addEventListener('mousemove', mouseMoveHandler);" +
            "    document.addEventListener('mouseup', mouseUpHandler);" +
            "};" +
            
            "iteration = 0;" +

            "const mouseMoveHandler = function (e) {" +
                "const styles = window.getComputedStyle(movable);" +
                "const dx = e.clientX - x;" +
                "const dy = e.clientY - y;" +
                "x = e.clientX;" +
                "y = e.clientY;" +
        
                "w = parseInt(styles.width, 10);" +
                "h = parseInt(styles.height, 10);" +
                "/* console.log('start iteration: '' + iteration); */" +
                "var old_left = parseInt(druggable.style.left, 10);" +
        
                "/* console.log('mouseMoveHandler: dx=' + dx + '    dy=' + dy); */" +
                "/* console.log('mouseMoveHandler: x=' + x + '    y=' + y + '    w=' + w + '    h=' + h); */" +
        
                "if (isLeftSide) {" +
                "   if (old_left) {" +
                "       druggable.style.left  = (old_left + dx) +'px';" +
                "       druggable.style.width = (w - dx) +'px';" +
                "       druggable.style.height = (h - dy) +'px';" +
                "   } else {" +
                "       druggable.style.left  = -1 +'px';" +
                "   }" +
                "} else {" +
                    "druggable.style.width = (w + dx) +'px';" +
                    "druggable.style.height = (h + dy) +'px';" +
                "}" +
        
                "/* console.log('mouseMoveHandler: width=' + druggable.style.width + '    height=' + druggable.style.height); */" +
                "/* console.log('end iteration: ' + iteration); */" +
               "iteration++;" +
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

    function meeting_template() {
        var today = new Date();

        var month = today.getMonth() + 1;
        var rawMonth = month.toString();

        if (month < 10)
            rawMonth = "0" + rawMonth;

        let title = document.getElementById('content-title');
        title.value = today.getFullYear() + '/' + rawMonth + '/' + today.getDate();

        let userKey = document.querySelector('meta[name="ajs-remote-user-key"]').content;
        let user = document.querySelector('meta[name="ajs-remote-user"]').content;
        let displayUser = document.querySelector('meta[name="ajs-current-user-fullname"]').content;

        let author = `<a class="confluence-link" href="./display/~${user}" userkey="${userKey}" data-base-url="." data-linked-resource-type="userinfo" data-linked-resource-default-alias="${displayUser}" data-mce-href="./display/~${user}">${displayUser}</a>`;

        let content = '' +
        '<div class="contentLayout2">' +
        '   <div class="columnLayout single" data-layout="single">' +
        '       <div class="cell normal" data-type="normal">' +
        '           <div class="innerCell" contenteditable="true">' +
        '               <p><time datetime="' + today.getFullYear() + '-' + rawMonth + '-' + today.getDate() +'" contenteditable="false" class="non-editable" onselectstart="return false;">' + today.getDate()  + '.' + rawMonth + '.' + today.getFullYear() +'</time>&nbsp;</p>' +
        '               <div contenteditable="false" data-mce-bogus="true" class="synchrony-container synchrony-exclude" style="user-select: none;">' +
        '               <div contenteditable="false" data-mce-bogus="true"></div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>' +
        '<div class="columnLayout single" data-layout="single">' +
        '   <div class="cell normal" data-type="normal">' +
        '       <div class="innerCell" contenteditable="true">' +
        '           <h1>'+ 'Участники' +'</h1>' +
        '           <p>' +
        `         ${author}&nbsp;</p></div></div></div><div class="columnLayout single" data-layout="single">` +
        '           <div class="cell normal" data-type="normal">' +
        '               <div class="innerCell" contenteditable="true">' +
        '                   <h1>Цель</h1>' +
        '                       <ol>' +
        '                           <li><br data-mce-bogus="1"></li>' +
        '                       </ol>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '       <div class="columnLayout single" data-layout="single">' +
        '           <div class="cell normal" data-type="normal">' +
        '               <div class="innerCell" contenteditable="true">' +
        '                   <h1>Action items</h1>' +
        '                   <ul>' +
        '                       <li>' +
        '                           <br data-mce-bogus="1">' +
        '                       </li>' +
        '                   </ul>' +
        '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>';
        
        let script = document.createElement('script');
        script.innerText = '(function(){ if (tinyMCE && tinyMCE.activeEditor)  {' +
            ' console.log(tinyMCE.document);' +
            'tinyMCE.activeEditor.setContent(\'' + content + ' \');' +
            ' } })();';
        document.body.appendChild(script);
    }

    function meetings_template() {
        var today = new Date();

        let title = document.getElementById('content-title');
        let nodeNames = document.getElementById("breadcrumbs");
        let lastNode = nodeNames.children.item(nodeNames.children.length - 1);
        let parrentNodeName = lastNode.children[0].children[0].innerText;

        title.value = "Meetings - " + parrentNodeName;

        let content = '' +
        '<div class="contentLayout2">' +
        '    <div class="columnLayout single" data-layout="single">' +
        '        <div class="cell normal" data-type="normal">' +
        '            <div class="innerCell" contenteditable="true">' +
        '                <p>' +
        '                    <img class="editor-inline-macro" src="/plugins/servlet/confluence/placeholder/macro?definition=e2NoaWxkcmVufQ&amp;locale=ru_RU&amp;version=2" data-macro-name="children" data-macro-schema-version="2" data-macro-id="ad2cdcff-3a2e-41cb-bc33-4154840e2fb5">' +
        '                    <br data-mce-bogus="1">' +
        '                </p>' +
        '                <div div contenteditable="false" data-mce-bogus="true" class="synchrony-container synchrony-exclude" style="user-select: none;">' +
        '                    <div contenteditable="false" data-mce-bogus="true">' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

        let script = document.createElement('script');
        script.innerText = '(function(){ if (tinyMCE && tinyMCE.activeEditor)  {' +
            ' console.log(tinyMCE.document);' +
            'tinyMCE.activeEditor.setContent(\'' + content + ' \');' +
            ' } })();';
        document.body.appendChild(script);
    }

    function fill_header() {
        var innder_thml = document.getElementById('wysiwygTextarea_ifr').contentWindow.document;
        let details_table = innder_thml.querySelectorAll('table[data-macro-name="details"]')[0];
        if (!details_table)
            return;

        let table = details_table.querySelectorAll('table')[0];
        if (!table)
            return;

        const ROW_COUNT = 8;
        if (table.rows.length != ROW_COUNT) {
            alert("Incorrect header of document");
            return;
        }

        let code_row = table.rows[0];
        let eng_name_row = table.rows[1];
        let ru_name_row = table.rows[2];
        let status_row = table.rows[3];
        let author_row = table.rows[4];
        let created_date_row = table.rows[5];
        let finished_date_row = table.rows[6];
        let links_row = table.rows[7];

        function change_value(row, value) {
            console.log("row: " + row);
            console.log("value: " + value);
            let comment = row.querySelectorAll("span")[0];
            if (!comment) 
                return;
            comment.parentElement.innerHTML = `${value}  ${comment.outerHTML}`;
        }

        let title = document.getElementById('content-title');
        let nodeNames = document.getElementById("breadcrumbs");
        let lastNode = nodeNames.children.item(nodeNames.children.length - 1);
        let parrentNodeName = lastNode.children[0].children[0].innerText;
        let full_name = parrentNodeName.split(' ');
        
        let id_parser = full_name[0].split('-');
        let project_id = id_parser[0];
        let parent_id = id_parser[1];

        let document_name = parrentNodeName.replace(full_name[0] + " ", "");
        let document_id = `${project_id}-TS.${parent_id}`;
        title.value = `${document_id} ${document_name}`;

        change_value(code_row, document_id);
        change_value(eng_name_row, document_name);

        let userKey = document.querySelector('meta[name="ajs-remote-user-key"]').content;
        let user = document.querySelector('meta[name="ajs-remote-user"]').content;
        let displayUser = document.querySelector('meta[name="ajs-current-user-fullname"]').content;

        let author = `<a class="confluence-link" href="./display/~${user}" userkey="${userKey}" data-base-url="." data-linked-resource-type="userinfo" data-linked-resource-default-alias="${displayUser}" data-mce-href="./display/~${user}">${displayUser}</a>`;
        change_value(author_row, author);

        var today = new Date();

        var month = today.getMonth() + 1;
        var rawMonth = month.toString();
        var rawDay = today.getDate().toString();

        if (month < 10)
            rawMonth = "0" + rawMonth;
        if (today.getDate() < 10)
            rawDay = "0" + rawDay;

        let datetime = '<time datetime="' + today.getFullYear() + '-' + rawMonth + '-' + rawDay +'" contenteditable="false" class="non-editable" onselectstart="return false;">' + rawDay  + '.' + rawMonth + '.' + today.getFullYear() +'</time>'
        change_value(created_date_row, datetime);
    }

    function show_all_anchors() {
        let anchors = document.querySelectorAll('span[data-macro-name="anchor"]');
        let title = document.getElementById('content-title');

        const css_style = "<style>" +
        "div:hover {" +
        "   color: blue;" +
        "}" +

        "</style>";
        const copy_script = "<script>"+ 
        "function copy(value) {" +
        "   navigator.clipboard.writeText(value);" +
        "   redirect(value);"+
        "}" +
        "function redirect(value) {" +
        "   var temp_messages = document.getElementById('messages');" +
        "   temp_messages.innerText ='Copied: ' + value;" +
        "   setTimeout(() => {" +
        "    temp_messages.innerText = '';" +
        "  }, 3000);" +
        "}" +
        "</script>";

        const header = `<!DOCTYPE html> <html> <title>${title.value} anchors </title> ${copy_script} ${css_style} <body>`;
        const footer = "</body> </html>";
        let content = [];
        content.push(`<p id="messages"></p>`);

        anchors.forEach(element => {
            let href =`${title.value}#${element.id.split("-")[1]}`;
            content.push(`<div onclick='copy(String.raw\`${href}\`)'>${href}</div>`);
        });

        const winUrl = URL.createObjectURL(
            new Blob([`${header} ${content.join("")} ${footer}`], { type: "text/html" })
        );

        const win = window.open(
            winUrl,
            "win",
            `width=600,height=300,screenX=200,screenY=200`
        );
    }

    function update_diagram_numbers() {
        var innder_thml = document.getElementById('wysiwygTextarea_ifr').contentWindow.document;
        let diagrams = innder_thml.querySelectorAll('table[data-macro-name="plantuml"]');

        for (var i = 0; i < diagrams.length; i++) {
            let diagram = diagrams[i];
            let diagram_order = i + 1;
            update_diagram_number(diagram, diagram_order);
            update_comment_line(diagram, diagram_order);
            update_theme(diagram);
        }

        function update_diagram_number(diagram, number) {
            var diagram_id_element = diagram.nextElementSibling.querySelector('p strong');
            var diagram_name = `Diagram ${number}: `;
            if (diagram_id_element) {
                diagram_id_element.innerText = diagram_name;
                console.log('Update diagram number on diagram: ', number);
            } else {
                let row = innder_thml.createElement('p');
                
                var number_row = innder_thml.createElement('strong');
                number_row.innerText = diagram_name;
                row.appendChild(number_row);

                var name_row = innder_thml.createElement('strong');
                name_row.classList.add('text-placeholder');
                name_row.innerText = "Название диаграммы, кратко описывающее суть на ней. Номер диаграммы инкрементируется";
                row.appendChild(name_row);

                diagram.parentNode.insertBefore(row, diagram.nextElementSibling);
                console.log('Add diagram number on diagram: ', number);
            }
        }

        function update_comment_line(diagram, number) {
            var diagram_comment_element = diagram.previousElementSibling;
            
            var diagram_comment = diagram_comment_element.querySelector('p span');

            if (diagram_comment && diagram_comment.innerText.startsWith('comment')) {
                 console.log('Exist comment line on diagram: ', number);
            } else {
                diagram_comment = innder_thml.createElement('p');
                var comment_row = innder_thml.createElement('span');

                comment_row.setAttribute("style", "color: #a5adba; letter-spacing: 0px");
                comment_row.innerHTML = 'comment #01 &nbsp; comment #02 &nbsp; comment #03 &nbsp; comment #04 &nbsp; comment #05 &nbsp; comment #06 &nbsp; comment #07 &nbsp; comment #08 &nbsp; comment #09 &nbsp; comment #10'

                diagram_comment.appendChild(comment_row);
                diagram_comment_element.appendChild(diagram_comment);
                console.log('Add comment line on diagram: ', number);
            }

        }

        function update_theme(diagram) {
            diagram.setAttribute("data-macro-parameters", "align=left|atlassian-macro-output-type=BLOCK|border=1|format=SVG|hspace=5|vspace=5|preserveWhiteSpaces=true");

            let content = diagram.querySelector('pre');
            if (content) {
                if (!content.innerText.startsWith("!theme vibrant")) {
                    content.innerText = "!theme vibrant \n" + content.innerText;
                }
            }
        }
    }

    registerSite(/^https?:\/\/confluence.*$/, [{
        action: "Enabled Hotkeys",
        script: registerHotkeys
    },{
        action: "Show comments readable",
        script: changeElement
    },{
        action: "Apply meetings template",
        script: meetings_template
    },{
        action: "Apply meeting template",
        script: meeting_template
     },{
        action: "Apply header of document",
        script: fill_header,
    },{
        action: "Show all anchors",
        script: show_all_anchors
    },{
        action: "Update diagrams",
        script: update_diagram_numbers
    }]);
})();

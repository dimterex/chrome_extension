let document_statuses = {
      "draft": { color: "yellow", subtle: true },
      "progress": { color: "blue", subtle: false },
      "review": { color: "blue", subtle: true },
      "rework": { color: "yellow", subtle: false },
      "hold": { color: "red", subtle: false },
      "estimate": { color: "gray", subtle: true },
      "done": { color: "green", subtle: false },
      "postponed": { color: "red", subtle: true },
      "obsolete": { color: "gray", subtle: false }
}

let qna_statuses= {
      "new": { color: "red", subtle: false },
      "progress": { color: "green", subtle: false },
      "answered": { color: "yellow", subtle: false },
      "done": { color: "blue", subtle: false },
      "stuck": { color: "gray", subtle: false }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      switch (request.id) {
            case "change_document_status":
                  let status = document_statuses[request.action];
                  if (status) {
                        change_document_status(request.action, status.color, status.subtle);
                  }
                  return;
            case "change_qna_status":
                  let qna_status = qna_statuses[request.action];
                  if (qna_status) {
                        change_document_status(request.action, qna_status.color, qna_status.subtle);
                  }
                  return;
      }
});


function change_document_status(title, color, subtle) {
      var innder_thml = document.getElementById('wysiwygTextarea_ifr').contentWindow.document;

      const selected_element = innder_thml.querySelectorAll('img[data-mce-selected="1"]');

      let status_element = selected_element[0];
      if (status_element) {
            color = color.charAt(0).toUpperCase() + color.slice(1);
            status_element.setAttribute("src", `/plugins/servlet/status-macro/placeholder?subtle=${subtle}&colour=${color}&title=${title}`);
            status_element.setAttribute("data-macro-parameters", `colour=${color}|subtle=${subtle}|title=${title}`);
      }
}

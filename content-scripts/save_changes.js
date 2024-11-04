
let save_changes_actions = {
      "save_changes": () => save_changes(),
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      let action = save_changes_actions[request.action];
      if (action) {
            action();
            return;
      }
});


function save_changes() {
      const htmlContent = "<!DOCTYPE html> \n" + document.documentElement.outerHTML;
      console.log(location.href);
      let filename = location.pathname.split('/').pop() || 'modified_page.html';
      filename = decodeURIComponent(filename);
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
}

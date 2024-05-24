let clickedElement = null;

document.addEventListener('mousedown', function(event) {
      if (event.button === 2) {
            clickedElement = event.target;
      }
}, true);

let element_actions = {
      "copy": (element) => copy(element),
      "paste": (element) => paste(element),
      "clear": (element) => clear(element),
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      let action = element_actions[request.action];
      if (action) {
            action(clickedElement);
            return;
      }
});

async function copy(element) {
      let text = element.innerHTML;
      await navigator.clipboard.writeText(text);
}

async function paste(element) {
      const text = await navigator.clipboard.readText();
      element.innerHTML = text;
}


function clear(element) {
      element.innerHTML = "";
}


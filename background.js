/**
 * Fired when the extension is first installed, when the extension is updated
 * to a new version, and when Chrome is updated to a new version.
 * @property {function}
 */
chrome.runtime.onInstalled.addListener(function() {
// Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
  // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
    {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: 'kinopoisk.ru/film' },
        })
      ],
      // And shows the extension's page action.
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    } ]);
	});
});

/**
* Отправка запроса на сервер
* @param {string} method
* @param {string} url
* @param {string} sentData
* @param {function} responseHandler
*/
function sendRequest(method, url, sentData, responseHandler) {
 var xhr = new XMLHttpRequest();

 xhr.open(method, url, true) ;

 xhr.onload = function () {
   if (xhr.status != 200) {
     console.log(xhr.status + ': ' + xhr.statusText);
   } else {
     responseHandler(xhr.responseText);
   }
 }

 xhr.send(sentData);
 return true;
}


/**
 * function is listening requests from popup.js or content-script.js
 * @property {function}
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  chrome.tabs.getSelected(null, function(tab) {
    (request === 'loadCategoies')?
      sendRequest('POST', 'http://localhost:8080/loadCategoriesForCurrentFilm', tab.url, sendResponse) :
      sendRequest(
        'POST',
        'http://localhost:8080/' + request.action,
        JSON.stringify( { 'url': tab.url, 'category': request.category } ),
        sendResponse
      );
  })

  return true;
});

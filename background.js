chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({finished_setup: false}, function() {
    console.log('finished_setup is set to false');
  });
  chrome.storage.local.set({passwordSaltDatabase: {}}, function() {
    console.log('passwordSaltDatabase is set to {}');
  });
  chrome.storage.local.set({bookmarkDatabase: {"Bookmarks":{}}}, function() {
    console.log('bookmarkDatabase is set to {"Bookmarks":{}}');
  });
});

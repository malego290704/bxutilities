folderSelector = document.getElementById("folderSelector");
var currentBookmarkDatabase;

bookmarkLinkTitle = document.getElementById("bookmarkLinkTitle");
bookmarkLinkURL = document.getElementById("bookmarkLinkURL");

openBookmarkTab.addEventListener("click", async () => {
  var _currentTab = await getCurrentTab();
  console.log(_currentTab.url, _currentTab.title);
  bookmarkLinkTitle.value = _currentTab.title;
  bookmarkLinkURL.value = _currentTab.url;
  chrome.storage.local.get("bookmarkDatabase", ({bookmarkDatabase}) => {
    currentBookmarkDatabase = bookmarkDatabase;
    console.log('bookmarkDatabase currently is ' + bookmarkDatabase);
    for (const [bookmarkFolder, bookmarkFolderData] of Object.entries(bookmarkDatabase)) {
      var _option = document.createElement("option");
      _option.text = bookmarkFolder;
      folderSelector.add(_option);
      console.log(bookmarkFolder, bookmarkFolderData);
    };
    _option = document.createElement("option");
    _option.text = "Trash can";
    folderSelector.add(_option);
  });
});

bookmarkSaveLink = document.getElementById("bookmarkSaveLink");
bookmarkOpenFolder = document.getElementById("bookmarkOpenFolder");
statusReport2 = document.getElementById("statusReport2");

bookmarkSaveLink.addEventListener("click", async () => {
  for (const [bookmarkFolder, bookmarkFolderData] of Object.entries(currentBookmarkDatabase)) {
    delete currentBookmarkDatabase[bookmarkFolder][bookmarkLinkURL.value];
  };
  if (folderSelector.value != "Trash can") {
    currentBookmarkDatabase[folderSelector.value][bookmarkLinkURL.value] = bookmarkLinkTitle.value;
  };
  chrome.storage.local.set({bookmarkDatabase: currentBookmarkDatabase}, function() {
    console.log('bookmarkDatabase is set to ' + currentBookmarkDatabase);
    statusReport2.innerHTML = "Link bookmarked in the ''" + folderSelector.value + "'' folder";
  });
});

bookmarkFolderViewTab = document.getElementById("bookmarkFolderViewTab");
bookmarkFolderView = document.getElementById("bookmarkFolderView");

function getBookmarkLinkBox(_title, _url, _index) {
  var _temp = document.createElement("a");
  _temp.className = "clickable";
  _temp.style.padding = "3px";
  _temp.style.margin = "3px 0px";
  _temp.style.fontSize = "15px";
  _temp.style.background = "var(--lightgrey)";
  _temp.style.color = "var(--black)";
  _temp.style.borderRadius = "3px";
  _temp.style.whiteSpace = "nowrap";
  _temp.innerHTML = _title;
  _temp.style.position = "absolute";
  _temp.style.top = (_index * 35 + 50) + "px";
  //_temp.href = _url;
  _temp.addEventListener("click", async () => {
    chrome.tabs.create({active: true, url: _url});
  });
  return _temp;
};

bookmarkOpenFolder.addEventListener("click", async () => {
  if (folderSelector.value == "Trash can") {return}
  while (bookmarkFolderView.hasChildNodes()) {
    bookmarkFolderView.removeChild(bookmarkFolderView.firstChild);
  };
  var _index = 0;
  for (const [bookmarkedURL, bookmarkedLink] of Object.entries(currentBookmarkDatabase[folderSelector.value])) {
    var _temp = getBookmarkLinkBox(bookmarkedLink, bookmarkedURL, _index);
    bookmarkFolderView.appendChild(_temp);
    _index++;
  };
  bookmarkFolderViewTab.style.left = "0%";
});

bookmarkNewFolder = document.getElementById("bookmarkNewFolder");

bookmarkNewFolder.addEventListener("click", async () => {
  var _temp = prompt("Name your new folder", "New folder");
  if (_temp != null) {
    currentBookmarkDatabase[_temp] = {};
    chrome.storage.local.set({bookmarkDatabase: currentBookmarkDatabase}, function() {
      if (folderSelector.length > 0) {
        folderSelector.remove(folderSelector.length - 1);
      }
      _option = document.createElement("option");
      _option.text = _temp;
      folderSelector.add(_option);
      _option = document.createElement("option");
      _option.text = "Trash can";
      folderSelector.add(_option);
      statusReport2.innerHTML = "Created new folder called '" + _temp + "'";
    });
  };
});

bookmarkDeleteFolder = document.getElementById("bookmarkDeleteFolder");

bookmarkDeleteFolder.addEventListener("click", async () => {
  var _temp = confirm("Do you want to delete this folder? This is irreversible");
  if (folderSelector.value == "Trash can" || !_temp) {return}
  var _temp = folderSelector.value, _temp2 = folderSelector.selectedIndex;
  folderSelector.value = "Trash can";
  delete currentBookmarkDatabase[_temp];
  chrome.storage.local.set({bookmarkDatabase: currentBookmarkDatabase}, function() {
    if (folderSelector.length > 0) {
      folderSelector.remove(_temp2);
    }
  });
  statusReport2.innerHTML = "Folder '" + _temp + "' deleted";
});

bookmarkExportFolder = document.getElementById("bookmarkExportFolder");
bookmarkExportFolder.addEventListener("click", async () => {
  if (folderSelector.value == "Trash can") {return}
  var _temp = JSON.stringify(currentBookmarkDatabase[folderSelector.value]);
  var _temp2 = folderSelector.value + "(}{##}{)" + _temp;
  copyTextToClipboard(_temp2);
  statusReport2.innerHTML = "Folder '" + folderSelector.value + "' exported";
});

bookmarkImportFolder = document.getElementById("bookmarkImportFolder");
function importBookmarkFolder(_input_s) {
  _temp = _input_s;
  if (_temp != null) {
    try {
      var _temp2 = _temp.slice(0, _temp.indexOf("(}{##}{)"));
      console.log(_temp2);
      var _temp3 = _temp.replace(_temp2 + "(}{##}{)", "");
      console.log(_temp3);
      var _temp4 = JSON.parse(_temp3);
      console.log(_temp4);
      for (const [bookmarkedURL, bookmarkedLink] of Object.entries(_temp4)) {
        if (currentBookmarkDatabase[_temp2] == undefined) {
          currentBookmarkDatabase[_temp2] = {};
        }
        currentBookmarkDatabase[_temp2][bookmarkedURL] = bookmarkedLink;
      };
      chrome.storage.local.set({bookmarkDatabase: currentBookmarkDatabase}, function() {
        if (folderSelector.length > 0) {
          folderSelector.remove(folderSelector.length - 1);
        }
        var _option = document.createElement("option");
        _option.text = _temp2;
        folderSelector.add(_option);
        _option = document.createElement("option");
        _option.text = "Trash can";
        folderSelector.add(_option);
      });
      statusReport2.innerHTML = "Folder '" + _temp2 + "' imported";
    } catch(err) {
      statusReport2.innerHTML = "Import unsuccessful"
    }
  }
};
bookmarkImportFolder.addEventListener("click", async () => {
  var _temp = prompt("Enter the folder data");
  if (_temp != null) {
    importBookmarkFolder(_temp);
  }
});


bookmarkExportEncryptFolder = document.getElementById("bookmarkExportEncryptFolder");
bookmarkImportEncryptFolder = document.getElementById("bookmarkImportEncryptFolder");

bookmarkExportEncryptFolder.addEventListener("click", async () => {
  console.log("bookmarkExportEncryptFolder");
  if (folderSelector.value == "Trash can") {return}
  var _temp = JSON.stringify(currentBookmarkDatabase[folderSelector.value]);
  var _temp2 = folderSelector.value + "(}{##}{)" + _temp;
  var _temp3 = prompt("Choose a password to encrypt the content");
  var _temp4 = CryptoJS.AES.encrypt(_temp2, _temp3);
  copyTextToClipboard(_temp4);
  statusReport2.innerHTML = "Folder '" + folderSelector.value + "' exported (encrypted)";
});

bookmarkImportEncryptFolder.addEventListener("click", async () => {
  console.log("bookmarkImportEncryptFolder");
  var _temp = prompt("Enter the folder data");
  var _temp2 = prompt("Enter the password");
  if (_temp != null) {
    var _temp3 = CryptoJS.AES.decrypt(_temp, _temp2);
    var _temp4 = _temp3.toString(CryptoJS.enc.Utf8);
    importBookmarkFolder(_temp4);
  }
});

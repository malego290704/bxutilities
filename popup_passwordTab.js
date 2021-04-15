tabLock = document.getElementById("tabLock");

tabLock.addEventListener("load", () => {
  console.log("Loaded");
  chrome.storage.local.get("finished_setup", ({finished_setup}) => {
    console.log('Value currently is ' + finished_setup);
    if (finished_setup) {
      tabLock.style.display = "none";
    } else {
      tabLock.style.display = "block";
    };
  });
});

tabLock.addEventListener("click", () => {
  console.log("Loaded");
  window.open("setup_page.html");
});

var logined = false;

function passwordChecker(_input_s) {
  var userPasswordH2Data;
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get("userPasswordH2", ({userPasswordH2}) => {
      console.log('Value currently is ' + userPasswordH2);
      console.log('Value type currently is ' + typeof(userPasswordH2));
      console.log(userPasswordH2);
      userPasswordH2Data = userPasswordH2;
      console.log(userPasswordH2Data);
      var _temp = sha256Base64(_input_s);
      var _temp2 = sha256Base64(_temp + userPasswordH2Data[1]);
      console.log(_temp2);
      console.log(userPasswordH2Data[0]);
      resolve(_temp2 == userPasswordH2Data[0]);
    });
  });
}

function getMasterPasswordSalt() {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get("userPasswordH2", ({userPasswordH2}) => {
      resolve(userPasswordH2[1]);
    });
  });
}

function getCurrentTab() {
  return new Promise(function(resolve, reject) {
    chrome.tabs.query({active: true, currentWindow: true},function(tabs){
      var currentTab = tabs[0];
      console.log(currentTab);
      resolve(currentTab);
    });
  })
}

function getDomain(url, subdomain) {
    subdomain = subdomain || false;
    url = url.replace(/(https?:\/\/)?(www.)?/i, '');
    if (!subdomain) {
        url = url.split('.');
        url = url.slice(url.length - 2).join('.');
    }
    if (url.indexOf('/') !== -1) {
        return url.split('/')[0];
    }
    return url;
}

function getPasswordSaltDatabase() {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get("passwordSaltDatabase", ({passwordSaltDatabase}) => {
      resolve(passwordSaltDatabase);
    });
  });
}

passwordBox = document.getElementById("passwordBox");
passwordOutputBox = document.getElementById("passwordOutputBox");
getPasswordButton = document.getElementById("getPasswordButton");
copyPasswordButton = document.getElementById("copyPasswordButton");
statusReport = document.getElementById("statusReport");

async function passwordOutputBoxUpdate(resalt) {
  console.log("Checking password");
  var _temp = passwordBox.value;
  _state = false;
  _state = await passwordChecker(_temp);
  console.log(_state);
  if (_state) {
    statusReport.innerHTML = "Password generated. Copy the password by clicking the button.";
    statusReport.style.color = "var(--black)";
    currentTab = await getCurrentTab();
    //statusReport.innerHTML += " " + currentTab.url;
    console.log(currentTab.url);
    _temp1 = getDomain(currentTab.url);
    console.log(_temp1);
    _temp2 = sha256Base64(passwordBox.value + await getMasterPasswordSalt());
    _temp3 = _temp1 + "($0)" + _temp2;
    console.log(_temp3);
    _database = await getPasswordSaltDatabase();
    console.log(_database);
    console.log(_database[_temp1]);
    //statusReport.innerHTML += " " + _database[_temp1];
    if (_database[_temp1] == undefined || resalt) {
      var _salt_complexity = 1000000000;
      var _salt = Math.floor(Math.random() * _salt_complexity).toString();
      _database[_temp1] = _salt;
    }
    _temp4 = sha256Base64(_temp3 + _database[_temp1]);
    passwordOutputBox.value = _temp4;
    console.log(_temp4);
    chrome.storage.local.set({passwordSaltDatabase: _database}, function() {
      console.log('Value is set to ' + _database);
    });
  } else {
    statusReport.innerHTML = "Wrong password.";
    statusReport.style.color = "var(--red)";
  };
};

getPasswordButton.addEventListener("click", async () => {
  await passwordOutputBoxUpdate(false);
});

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  //textArea.style.display = 'none';
  //
  textArea.value = text;
  //
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  //
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  //
  document.body.removeChild(textArea);
}

copyPasswordButton.addEventListener("click", async () => {
  copyTextToClipboard(passwordOutputBox.value);
  statusReport.innerHTML = "Password copied";
  //statusReport.innerHTML += " " + passwordOutputBox.value;
});

newSaltButton = document.getElementById("newSaltButton");
newSaltButton.addEventListener("click", async () => {
  console.log("Checking password");
  var _temp = passwordBox.value;
  _state = false;
  _state = await passwordChecker(_temp);
  if (_state == false) {
    statusReport.innerHTML = "Wrong password.";
    return;
  };
  console.log(_state);
  var _temp2 = confirm("Are you sure to get a new password? The old password cannot be recovered");
  if (_temp2) {
    await passwordOutputBoxUpdate(true);
    statusReport.innerHTML = "New password generated";
  };
});

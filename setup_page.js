registerButton = document.getElementById("registerButton");
passwordBox = document.getElementById("passwordBox");
passwordReBox = document.getElementById("passwordReBox");

function passwordBoxUpdate(passwordBoxInput) {
  var _temp = passwordBoxInput.length;
  if (_temp < 6) {
    return false;
  }
  var _lettered = false, _digited = false;
  for (i = 0; i < _temp; i++) {
    var _currentChar = passwordBoxInput.charCodeAt(i);
    if (_currentChar >= 48 && _currentChar <= 57) {
      _digited = true;
    } else if (_currentChar >= 97 && _currentChar <= 122) {
      _lettered = true;
    }
  }
  return _digited && _lettered;
}

function passwordReBoxUpdate(passwordBoxInput, passwordReBoxInput) {
  return passwordBoxInput == passwordReBoxInput && passwordBoxUpdate(passwordReBoxInput);
}

passwordBox.addEventListener("input", async () => {
  var _temp = passwordBox.value;
  var _state = passwordBoxUpdate(_temp);
  if (!_state) {
    passwordBox.style.borderBottom = "2px solid var(--red)";
  } else {
    passwordBox.style.borderBottom = "2px solid var(--cyan)";
  }
  var _temp2 = passwordReBox.value;
  var _state2 = passwordReBoxUpdate(_temp, _temp2);
  if (!_state2) {
    passwordReBox.style.borderBottom = "2px solid var(--red)";
  } else {
    passwordReBox.style.borderBottom = "2px solid var(--cyan)";
  }
});

passwordReBox.addEventListener("input", async () => {
  var _temp = passwordBox.value, _temp2 = passwordReBox.value;
  var _state = passwordReBoxUpdate(_temp, _temp2);
  if (!_state) {
    passwordReBox.style.borderBottom = "2px solid var(--red)";
  } else {
    passwordReBox.style.borderBottom = "2px solid var(--cyan)";
  }
});

registerButton.addEventListener("click", async () => {
  var _temp = passwordBox.value, _temp2 = passwordReBox.value;
  var _state = passwordReBoxUpdate(_temp, _temp2);
  if (_state) {
    console.log("Valid register");
    var _temp3 = sha256Base64(_temp);
    var _salt_complexity = 1000000000;
    var _salt = Math.floor(Math.random() * _salt_complexity).toString();
    var _temp4 = sha256Base64(_temp3 + _salt);
    var _data_package = [_temp4, _salt];
    chrome.storage.local.set({finished_setup: true}, function() {
      console.log('finished_setup is set to true');
    });
    chrome.storage.local.set({userPasswordH2: _data_package}, function() {
      console.log('userPasswordH2 is set to' + _data_package);
    });
    console.log(_data_package);
    //alert(_data_package);
    close();
    //console.log(_temp3 = sha256Base64(_temp));
  }
});

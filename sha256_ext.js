function convertHexToBinary(_input_s) {
  _lookupTable = "0123456789abcdef";
  _output_a = [];
  _input_l = _input_s.length;
  for (i = 0; i <= _input_l; i++) {
    for (j = 0; j <= 15; j++) {
      if (_input_s[i] == _lookupTable[j]) {
        _output_a.push((j & 8) / 8);
        _output_a.push((j & 4) / 4);
        _output_a.push((j & 2) / 2);
        _output_a.push((j & 1) / 1);
        break;
      }
    }
  }
  return _output_a;
}

function convertBinaryToBase64(_input_a) {
  _lookupTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
  _output_s = "";
  _input_l = _input_a.length;
  _input_a.push(0);
  _input_a.push(0);
  for (i = 0; i < _input_l; i += 6) {
    _output_s += (_lookupTable[_input_a[i] * 32 + _input_a[i + 1] * 16 + _input_a[i + 2] * 8 + _input_a[i + 3] * 4 + _input_a[i + 4] * 2 + _input_a[i + 5] * 1]);
  }
  return _output_s;
}

function convertHexToBase64(_input_s) {
  var _temp;
  _temp = convertHexToBinary(_input_s);
  _temp = convertBinaryToBase64(_temp);
  return _temp;
}

function sha256Base64(_input_s) {
  var _temp;
  _temp = sha256(_input_s);
  _temp = convertHexToBase64(_temp);
  return _temp;
}

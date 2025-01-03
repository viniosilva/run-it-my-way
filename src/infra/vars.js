const vars = {};

function setValue(key, value) {
  vars[key] = value;
}

function getValue(key) {
  return vars[key];
}

module.exports = {
  setValue,
  getValue,
};

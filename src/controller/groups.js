const { vars } = require("../global");

function getGroup() {
  return vars.groups.find((g) => g.id === vars.groupId);
}

function getCollection() {
  const groupId = vars.groupId;
  const collectionId = vars.collectionId;

  return vars.groups
    .find((g) => g.id === groupId)
    ?.collections.find((c) => c.id === collectionId);
}

module.exports = {
  getGroup,
  getCollection,
};

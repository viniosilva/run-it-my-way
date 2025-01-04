function focusItem(items, next) {
  const item = getItem(items, next);
  item.scrollIntoView({ inline: "center" });
  item.focus({ preventScroll: true });
}

function focusItemList(items, next) {
  const item = getItem(items, next);
  item.focus();
}

function getItem(items, next) {
  const item = items?.find(
    (el) => el.tabIndex === document.activeElement.tabIndex + next
  );

  if (item) return item;
  return next === 1 ? items[0] : items[items.length - 1];
}

function onReady(cb) {
  setTimeout(cb, 0);
}

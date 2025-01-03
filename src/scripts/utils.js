function focusItem(items, next, list) {
  let item = items?.find(
    (el) => el.tabIndex === document.activeElement.tabIndex + next
  );

  if (!item) {
    item = next === 1 ? items[0] : items[items.length - 1];
  }

  !list && item.scrollIntoView({ inline: "center" });
  item.focus({ preventScroll: !list });

  return item;
}

function onReady(cb) {
  setTimeout(cb, 0);
}

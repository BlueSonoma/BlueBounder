export function toggleShowSidebar(sidebarType, setterFunc) {
  setterFunc({
    ...sidebarType, show: !sidebarType.show,
  });
}
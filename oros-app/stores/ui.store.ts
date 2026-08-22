let sidebarOpen = false;

export function getSidebarOpen() {
  return sidebarOpen;
}

export function setSidebarOpen(next: boolean) {
  sidebarOpen = next;
  return sidebarOpen;
}

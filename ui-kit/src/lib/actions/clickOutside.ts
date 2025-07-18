export function clickOutside(node: HTMLElement, config: { handleClick: () => void }) {
  const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
          config.handleClick();
      }
  };

  document.addEventListener('click', handleClick, true);

  return {
      destroy() {
          document.removeEventListener('click', handleClick, true);
      },
      update(newConfig: { handleClick: () => void }) {
          config = newConfig;
      }
  };
}
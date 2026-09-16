/* Mermaid rendering override: wait for web fonts before measuring node labels. */
(() => {
  const mermaidSelector = '.mermaid';
  const fontReadyTimeout = 2500;

  function waitForFonts() {
    if (!document.fonts || !document.fonts.ready) {
      return Promise.resolve();
    }

    return Promise.race([
      document.fonts.ready,
      new Promise((resolve) => setTimeout(resolve, fontReadyTimeout))
    ]);
  }

  async function render() {
    await waitForFonts();
    await window.mermaid.run({
      nodes: document.querySelectorAll(mermaidSelector)
    });
  }

  function initialize() {
    if (!window.mermaid || typeof window.mermaid.initialize !== 'function') {
      return;
    }

    const theme =
      window.Theme && window.Theme.resolvedTheme === 'dark' ? 'dark' : 'default';

    window.mermaid.initialize({ theme, startOnLoad: false });
    void render();
  }

  initialize();
})();

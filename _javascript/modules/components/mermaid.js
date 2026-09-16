/**
 * Mermaid-js loader
 */

const MERMAID = 'mermaid';
const FONT_READY_TIMEOUT = 2500;
const themeMap = Theme.newThemeMap('default', 'dark');

function waitForFonts() {
  if (!document.fonts || !document.fonts.ready) {
    return Promise.resolve();
  }

  return Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, FONT_READY_TIMEOUT))
  ]);
}

async function renderMermaid() {
  await waitForFonts();
  await mermaid.run({
    nodes: document.querySelectorAll(`.${MERMAID}`)
  });
}

function refreshTheme(event) {
  if (
    event.source === window &&
    event.data &&
    event.data.id === Theme.eventId
  ) {
    // Re-render the SVG › <https://github.com/mermaid-js/mermaid/issues/311#issuecomment-332557344>
    const mermaidList = document.getElementsByClassName(MERMAID);

    [...mermaidList].forEach((elem) => {
      const svgCode = elem.previousSibling.children.item(0).textContent;
      elem.textContent = svgCode;
      elem.removeAttribute('data-processed');
    });

    const newTheme = themeMap[Theme.resolvedTheme];

    mermaid.initialize({ theme: newTheme, startOnLoad: false });
    void renderMermaid();
  }
}

function setNode(elem) {
  const svgCode = elem.textContent;
  const backup = elem.parentElement;
  backup.classList.add('d-none');
  // Create mermaid node
  const mermaid = document.createElement('pre');
  mermaid.classList.add(MERMAID);
  const text = document.createTextNode(svgCode);
  mermaid.appendChild(text);
  backup.after(mermaid);
}

export function loadMermaid() {
  if (
    typeof mermaid === 'undefined' ||
    typeof mermaid.initialize !== 'function'
  ) {
    return;
  }

  const initTheme = themeMap[Theme.resolvedTheme];

  const mermaidConf = {
    theme: initTheme,
    startOnLoad: false
  };

  const basicList = document.getElementsByClassName('language-mermaid');
  [...basicList].forEach(setNode);

  mermaid.initialize(mermaidConf);
  void renderMermaid();

  if (Theme.isToggleable) {
    window.addEventListener('message', refreshTheme);
  }
}

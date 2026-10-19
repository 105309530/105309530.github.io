(() => {
  const icons = {
    code: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5-6 7 6 7M16 5l6 7-6 7m-8 8 4-16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    wrap: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6v4M20 6v4M12 4v10m-3-3 3 3 3-3M6 18h12"/></svg>`,
    nowrap: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 5v14M6 8h7a3 3 0 1 1 0 6H9m0-3-3 3 3 3"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
    check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 5 5L20 6"/></svg>`
  };
  const aliases = {
    ps: 'powershell', ps1: 'powershell', pwsh: 'powershell',
    py: 'python', js: 'javascript', ts: 'typescript',
    sh: 'bash', shell: 'bash', zsh: 'bash', yml: 'yaml',
    cs: 'c#', csharp: 'c#', cpp: 'c++', plaintext: 'text'
  };

  async function copyToClipboard(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const input = document.createElement('textarea');
    input.value = value;
    input.setAttribute('readonly', '');
    input.style.cssText = 'position:fixed;opacity:0;left:-9999px';
    document.body.appendChild(input);
    input.select();
    const successful = document.execCommand('copy');
    input.remove();
    if (!successful) throw new Error('Clipboard copy failed');
  }

  function initialize() {
    document.querySelectorAll('figure.highlight').forEach((figure) => {
      if (figure.querySelector('.codex-toolbar')) return;
      const pre = figure.querySelector('td.code pre');
      if (!pre) return;

      const rawLang = [...figure.classList].find((name) => name !== 'highlight') || 'text';
      const language = aliases[rawLang.toLowerCase()] || rawLang.toLowerCase();

      const toolbar = document.createElement('div');
      toolbar.className = 'codex-toolbar';

      const label = document.createElement('div');
      label.className = 'codex-label';
      const symbol = document.createElement('span');
      symbol.innerHTML = icons.code;
      const name = document.createElement('span');
      name.textContent = language;
      label.append(symbol, name);

      const actions = document.createElement('div');
      actions.className = 'codex-actions';

      const wrap = document.createElement('button');
      wrap.type = 'button';
      wrap.className = 'codex-btn';
      wrap.title = '开启自动换行';
      wrap.setAttribute('aria-label', '切换自动换行');
      wrap.setAttribute('aria-pressed', 'false');
      wrap.innerHTML = icons.wrap;
      wrap.addEventListener('click', () => {
      const enabled = figure.classList.toggle('codex-wrap');

      wrap.innerHTML = enabled ? icons.nowrap : icons.wrap;
      wrap.setAttribute('aria-pressed', String(enabled));
      wrap.title = enabled ? '关闭自动换行' : '开启自动换行';
      wrap.setAttribute('aria-label', wrap.title);
});

      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'codex-btn';
      copy.title = '复制代码';
      copy.setAttribute('aria-label', '复制代码');
      copy.innerHTML = icons.copy;
      copy.addEventListener('click', async () => {
        // Hexo splits rendered code into .line spans; retain indentation and newlines.
        const lines = pre.querySelectorAll(':scope > .line');
        const code = lines.length
          ? [...lines].map((line) => line.textContent).join('\n')
          : pre.innerText.replace(/\n$/, '');
        try {
          await copyToClipboard(code);
          copy.title = '复制成功';
          copy.setAttribute('aria-label', '复制成功');
          copy.innerHTML = icons.check;
        } catch (e) {
          copy.title = '复制失败';
          copy.setAttribute('aria-label', '复制失败');
          console.error(e);
        }
        setTimeout(() => {
          copy.title = '复制代码';
          copy.setAttribute('aria-label', '复制代码');
          copy.innerHTML = icons.copy;
        }, 1500);
      });
      actions.append(wrap, copy);
      toolbar.append(label, actions);
      figure.prepend(toolbar);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();

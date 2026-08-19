function contactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const res = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      status.textContent = "Pesan berhasil terkirim, terimakasih";
      status.className = "flex flex-col mt-4 text-sm text-emerald-400 w-full flex items-center font-mono text-center text-8";
      form.reset();
    } else {
      status.textContent = "Gagal mengirim pesan, coba lagi ya.";
      status.className = "flex flex-col mt-4 text-sm w-full text-red-400 flex items-center font-mono text-center text-8";
    }
  });
}

function createGithubExplorer({ owner, repo, rootFolder = "", treeId, viewerId }) {

  async function fetchContents(path) {
    const url = path
      ? `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
      : `https://api.github.com/repos/${owner}/${repo}/contents`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gagal fetch: ${res.status}`);
    return res.json();
  }

  async function fetchFileContent(downloadUrl) {
    const res = await fetch(downloadUrl);
    return res.text();
  }

function addCopyButtons(container) {
  const preBlocks = container.querySelectorAll("pre");

  preBlocks.forEach((pre) => {
    pre.classList.add("relative", "group");

    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.className =
      "absolute top-2 right-2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity";

    btn.onclick = () => {
      const code = pre.querySelector("code");
      const text = code ? code.textContent : pre.textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      });
    };

    pre.appendChild(btn);
  });
}

async function loadFile(item) {
  const viewer = document.getElementById(viewerId);
  if (!viewer) return;

  const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".ico"];
  const isImage = imageExtensions.some(ext => item.name.toLowerCase().endsWith(ext));

  if (isImage) {
    viewer.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <img src="${item.download_url}" alt="${item.name}" class="max-w-full max-h-full object-contain rounded-lg" />
      </div>
    `;
    return;
  }

const content = await fetchFileContent(item.download_url);

 if (item.name.endsWith(".md")) {
    const { marked } = await import("marked");
    const basePath = item.path.substring(0, item.path.lastIndexOf("/"));

    let html = marked.parse(content);

    html = html.replace(/(<img[^>]+src=")([^"]+)(")/g, (match, pre, src, post) => {
      let newSrc = src;
      if (src.includes("github.com") && src.includes("/blob/")) {
        newSrc = src.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
      } else if (!/^https?:\/\//.test(src)) {
        const clean = src.replace(/^\.\//, "");
        newSrc = `https://raw.githubusercontent.com/${owner}/${repo}/main/${basePath ? basePath + "/" : ""}${clean}`;
      }
      return `${pre}${newSrc}${post}`;
    });

    viewer.innerHTML = html;
    addCopyButtons(viewer);
    
  } else {
    const hljs = (await import("highlight.js")).default;
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.textContent = content;
    pre.appendChild(code);
    viewer.innerHTML = "";
    viewer.appendChild(pre);
    hljs.highlightElement(code);
    addCopyButtons(viewer);
  }
}


  async function renderTree(path, container) {
    const items = await fetchContents(path);

    items.sort((a, b) => {
        if (a.type === b.type) {
        return a.name.localeCompare(b.name);
        }
        return a.type === "dir" ? -1 : 1;
    });

    for (const item of items) {
      if (item.type === "dir") {
        const folderEl = document.createElement("div");
        folderEl.innerHTML = `<span class="folder cursor-pointer block truncate" title="${item.name}">📁 ${item.name}</span>`;
        const subContainer = document.createElement("div");
        subContainer.classList.add("pl-4", "hidden");

        folderEl.querySelector(".folder").onclick = () => {
          subContainer.classList.toggle("hidden");
          if (subContainer.dataset.loaded !== "true") {
            renderTree(item.path, subContainer);
            subContainer.dataset.loaded = "true";
          }
        };

        folderEl.appendChild(subContainer);
        container.appendChild(folderEl);
      } else {
        const fileEl = document.createElement("div");
        fileEl.textContent = `📄 ${item.name}`;
        fileEl.classList.add("cursor-pointer", "hover:text-cyan-400", "truncate", "block");
        fileEl.title = item.name; 
        fileEl.onclick = () => loadFile(item);
        container.appendChild(fileEl);
      }
    }
  };

  function init() {
    const container = document.getElementById(treeId);
    if (!container) return;
    container.innerHTML = "";
    renderTree(rootFolder, container);
  }

  return { init };
};

const projectExplorer = createGithubExplorer({
  owner: "ikii2008",
  repo: "Project",
  rootFolder: "",
  treeId: "file-tree",
  viewerId: "file-viewer",
});

const writeupExplorer = createGithubExplorer({
  owner: "ikii2008",
  repo: "Write-up-LKS",
  rootFolder: "",
  treeId: "writeup-tree",
  viewerId: "writeup-viewer",
});



function terminal() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    if (!terminalInput || !terminalOutput) return;

    const container = document.getElementById('terminal-output');
    const files = JSON.parse(container.dataset.files || '{}');

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
        const rawInput = terminalInput.value.trim();

        const parts = rawInput.split(' ');
        
        const command = parts[0].toLowerCase();
        const fileName = parts[1];

        if (rawInput !== '') {
            terminalOutput.innerHTML += `<div><span class="text-emerald-500 font-bold">&gt;</span> ${rawInput}</div>`;
        }

        switch (command) {
            case 'help':
                terminalOutput.innerHTML += `<div class="text-emerald-300">Command yang tersedia: help, whoami, clear</div>`;
            break;
            case 'whoami':
                terminalOutput.innerHTML += `<div class="text-emerald-300">Network & Cybersecurity Enthusiast.</div>`;
            break;
            case 'clear':
                terminalOutput.innerHTML = '';
            break;
            /*case 'ls':
                const fileList = Object.keys(files).join('&nbsp;&nbsp;&nbsp;&nbsp;');
                terminalOutput.innerHTML += `<div class="text-emerald-300">${fileList || 'Tidak ada file'}</div>`;
            break;
            case 'cat':
                if (!fileName) {
                    terminalOutput.innerHTML += `<div class="text-yellow-400">Penggunaan: cat [nama_file] (contoh: cat about.txt)</div>`;
                } else if (files[fileName]) {
                    const content = files[fileName].replace(/\n/g, '<br>');
                    terminalOutput.innerHTML += `<div class="text-emerald-300">${content}</div>`;
                } else {
                    terminalOutput.innerHTML += `<div class="text-red-400">cat: ${fileName}: File tidak ditemukan</div>`;
                }
            break;*/
            default:
            if (command !== '') {
                terminalOutput.innerHTML += `<div class="text-red-400">Command '${command}' tidak ditemukan. Ketik 'help'.</div>`;
            }
            break;
        }
        terminalInput.value = '';
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }})
}

function initCertPreview() {
    const certButtons = document.querySelectorAll('.cert-btn');
    const previewImg = document.getElementById('preview-image');
    const placeholderText = document.getElementById('placeholder-text');
    const spinner = document.getElementById('loading-spinner');

    if (!previewImg) return;

    certButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const imageSrc = button.getAttribute('data-src');
            if (!imageSrc) return;
        
            const img = new Image();
            img.src = imageSrc;
            
            if (spinner) spinner.classList.remove('hidden');
            if (placeholderText) {
                    placeholderText.classList.add('hidden');
                }
            previewImg.classList.add('hidden');
            
            certButtons.forEach(b => {
                b.classList.remove('border-cyan-400', 'text-cyan-300', 'scale-103');
                b.classList.add('text-cyan-400', 'border-slate-700');
                });

                button.classList.remove('text-cyan-400', 'border-slate-700');
                button.classList.add('border-cyan-400', 'text-cyan-300', 'scale-103');

            img.onload = () => {
                if (spinner) spinner.classList.add('hidden');

                const isLandscape = img.naturalWidth >= img.naturalHeight;

                previewImg.className = "rounded-lg shadow-2xl object-contain transition-all";

                if (isLandscape) {
                    previewImg.classList.add('max-w-2xl', 'max-h-[75vh]', 'w-full');
                } else {
                    previewImg.classList.add('max-w-md', 'max-h-[85vh]', 'w-auto');
                }

                previewImg.src = imageSrc;
                previewImg.classList.remove('hidden');
            }})
    })
}

function mobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  })
}

export function initApp() {
    projectExplorer.init();
    writeupExplorer.init();
    terminal();
    initCertPreview();
    contactForm();
    mobileMenu();
}
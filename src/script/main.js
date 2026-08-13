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
                terminalOutput.innerHTML += `<div class="text-emerald-300">Command yang tersedia: help, whoami, clear, ls, cat</div>`;
            break;
            case 'whoami':
                terminalOutput.innerHTML += `<div class="text-emerald-300">Network & Cybersecurity Enthusiast.</div>`;
            break;
            case 'clear':
                terminalOutput.innerHTML = '';
            break;
            case 'ls':
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
            break;
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

export function initApp() {
    terminal();
    initCertPreview();
}

document.addEventListener('DOMContentLoaded', terminal);
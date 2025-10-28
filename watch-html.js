import { watch } from 'fs';
import { copyFileSync, readdirSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

// При запуске скрипта - сразу копируем всё
console.log('📋 Copying HTML, assets and data...\n');
copyHtmlFiles();
copyAssets();
copyData();

// Теперь следим за изменениями HTML
console.log('👀 Watching HTML files for changes...\n');

watch('.', { recursive: false }, (eventType, filename) => {
    if (filename && filename.endsWith('.html')) {
        console.log(`📄 ${filename} changed → copying to dist/`);
        copyHtmlFiles();
    }
});

// Следим за изменениями в data/
try {
    if (statSync('data', { throwIfNoEntry: false })) {
        watch('data', { recursive: true }, (eventType, filename) => {
            if (filename) {
                console.log(`📊 data/${filename} changed → copying to dist/`);
                copyData();
            }
        });
    }
} catch (err) {
    // Нет папки data
}

// ============================================
// Копирует все .html из корня в dist/
// ============================================
function copyHtmlFiles() {
    mkdirSync('dist', { recursive: true });

    const files = readdirSync('.');
    files.forEach(file => {
        if (file.endsWith('.html')) {
            copyFileSync(file, join('dist', file));
        }
    });
}

// ============================================
// Копирует папку assets в dist/assets
// ============================================
function copyAssets() {
    try {
        if (statSync('assets', { throwIfNoEntry: false })) {
            copyDir('assets', 'dist/assets');
            console.log('📁 Copied assets/ → dist/assets/\n');
        }
    } catch (err) {
        // Нет папки assets - ничего страшного
    }
}

// ============================================
// Копирует папку data в dist/data
// ============================================
function copyData() {
    try {
        if (statSync('data', { throwIfNoEntry: false })) {
            copyDir('data', 'dist/data');
            console.log('📊 Copied data/ → dist/data/\n');
        }
    } catch (err) {
        // Нет папки data - ничего страшного
    }
}

function copyDir(src, dest) {
    mkdirSync(dest, { recursive: true });
    const entries = readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFileSync(srcPath, destPath);
        }
    }
}

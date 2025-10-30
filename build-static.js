import { copyFileSync, readdirSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('📋 Copying static files to dist/...\n');

mkdirSync('dist', { recursive: true });
const files = readdirSync('.');
files.forEach(file => {
    if (file.endsWith('.html')) {
        copyFileSync(file, join('dist', file));
        console.log(`✅ ${file} → dist/`);
    }
});

try {
    if (statSync('assets', { throwIfNoEntry: false })) {
        copyDir('assets', 'dist/assets');
        console.log('✅ assets/ → dist/assets/');
    }
} catch (err) {

}

try {
    if (statSync('data', { throwIfNoEntry: false })) {
        copyDir('data', 'dist/data');
        console.log('✅ data/ → dist/data/');
    }
} catch (err) {

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

console.log('\n✅ Static files copied!');

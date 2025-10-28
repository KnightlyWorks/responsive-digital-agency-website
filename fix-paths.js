import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

console.log('🔧 Fixing HTML paths...\n');

// Находим все HTML файлы в корне
const htmlFiles = readdirSync('.').filter(file => file.endsWith('.html'));

if (htmlFiles.length === 0) {
    console.log('❌ No HTML files found in root directory.');
    process.exit(1);
}

let totalChanges = 0;

htmlFiles.forEach(file => {
    console.log(`📄 Processing: ${file}`);

    let content = readFileSync(file, 'utf-8');
    let changes = 0;

    // Список замен (что → на что)
    const replacements = [
        // CSS файлы
        { from: /href=["']\/dist\/css\//g, to: 'href="/css/', name: 'CSS paths' },
        { from: /href=["']dist\/css\//g, to: 'href="/css/', name: 'CSS paths (relative)' },
                  { from: /href=["']src\/styles\/tailwind\.css["']/g, to: 'href="/css/tailwind.css"', name: 'Old Tailwind path' },

                  // JavaScript файлы
                  { from: /src=["']\/dist\/js\//g, to: 'src="/js/', name: 'JS paths' },
                  { from: /src=["']dist\/js\//g, to: 'src="/js/', name: 'JS paths (relative)' },
                  { from: /src=["']src\/js\/main\.js["']/g, to: 'src="/js/bundle.js"', name: 'Old main.js path' },
                  { from: /src=["']\/dist\/bundle\.js["']/g, to: 'src="/js/bundle.js"', name: 'Old bundle path' },
                  { from: /src=["']dist\/bundle\.js["']/g, to: 'src="/js/bundle.js"', name: 'Old bundle path (relative)' },

                  // Assets (images, fonts, icons)
                  { from: /src=["']\/dist\/assets\//g, to: 'src="/assets/', name: 'Image src paths' },
                  { from: /src=["']dist\/assets\//g, to: 'src="/assets/', name: 'Image src paths (relative)' },
                  { from: /href=["']\/dist\/assets\//g, to: 'href="/assets/', name: 'Asset href paths' },
                  { from: /href=["']dist\/assets\//g, to: 'href="/assets/', name: 'Asset href paths (relative)' },

                  // Favicon и другие link
                  { from: /href=["']\/dist\/favicon\./g, to: 'href="/favicon.', name: 'Favicon paths' },
                  { from: /href=["']dist\/favicon\./g, to: 'href="/favicon.', name: 'Favicon paths (relative)' },

                  // srcset для responsive images
                  { from: /srcset=["'][^"']*\/dist\/assets\//g, to: (match) => match.replace('/dist/assets/', '/assets/'), name: 'srcset paths' },

                  // data-src (для lazy loading)
                  { from: /data-src=["']\/dist\//g, to: 'data-src="/', name: 'data-src paths' },
                  { from: /data-src=["']dist\//g, to: 'data-src="/', name: 'data-src paths (relative)' },
    ];

    // Применяем все замены
    replacements.forEach(({ from, to, name }) => {
        const beforeLength = content.length;
        content = content.replace(from, to);
        const afterLength = content.length;

        if (beforeLength !== afterLength) {
            changes++;
            console.log(`  ✓ Fixed: ${name}`);
        }
    });

    // Убеждаемся что <script> имеет type="module" для bundle.js
    if (content.includes('src="/js/bundle.js"') && !content.includes('type="module"')) {
        content = content.replace(
            /<script(\s+)src=["']\/js\/bundle\.js["']>/g,
                                  '<script type="module"$1src="/js/bundle.js">'
        );
        changes++;
        console.log(`  ✓ Added: type="module" to bundle.js`);
    }

    // Сохраняем файл если были изменения
    if (changes > 0) {
        writeFileSync(file, content, 'utf-8');
        console.log(`  📝 Saved: ${file} (${changes} changes)\n`);
        totalChanges += changes;
    } else {
        console.log(`  ⏭️  No changes needed\n`);
    }
});

console.log('─'.repeat(50));
if (totalChanges > 0) {
    console.log(`✅ Done! Fixed ${totalChanges} path(s) in ${htmlFiles.length} file(s).`);
    console.log('\n💡 Paths now use:');
    console.log('   /css/tailwind.css');
    console.log('   /js/bundle.js');
    console.log('   /assets/images/...');
} else {
    console.log('✅ All paths are already correct!');
}

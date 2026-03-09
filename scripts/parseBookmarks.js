const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('bookmarks.html', 'utf-8');
const dom = new JSDOM(html);
const document = dom.window.document;

function parseDL(dlElement) {
  const items = [];
  const children = dlElement.children;
  for (let child of children) {
    if (child.tagName === 'DT') {
      const h3 = child.querySelector('H3');
      if (h3) {
        // Folder
        const folder = {
          name: h3.textContent.trim(),
          type: 'folder',
          children: [],
          links: []
        };
        const nextDL = child.querySelector('DL');
        if (nextDL) {
          const { children: subItems, links: subLinks } = parseDL(nextDL);
          folder.children = subItems;
          folder.links = subLinks;
        }
        items.push(folder);
      } else {
        // Link
        const a = child.querySelector('A');
        if (a) {
          items.push({
            type: 'link',
            name: a.textContent.trim(),
            url: a.getAttribute('HREF')
          });
        }
      }
    }
  }
  // Separate folders and links for easier consumption
  const folders = items.filter(i => i.type === 'folder');
  const links = items.filter(i => i.type === 'link');
  return { children: folders, links };
}

const rootDL = document.querySelector('DL');
const { children, links } = parseDL(rootDL);

// The top-level "Bookmarks Bar" folder is the root
const dsaTree = children.length ? children : [];

fs.writeFileSync('dsaData.json', JSON.stringify(dsaTree, null, 2));
console.log('✅ Converted bookmarks to dsaData.json');
const fs = require('fs')
const path = require('path')

const distFolder = path.join(__dirname, 'dist/assets') // Change this path if your dist folder is located elsewhere

fs.readdirSync(distFolder).forEach((file) => {
    if (file.endsWith('.css')) {
        const filePath = path.join(distFolder, file)
        let cssContent = fs.readFileSync(filePath, 'utf8')
        cssContent = cssContent.replace(/(woff|eot|woff2|ttf)\?v=\d+\.\d+\.\d+/g, '$1') // Replace the query parameter with any version number only if it's preceded by 'woff', 'eot', 'woff2', 'ttf'
        fs.writeFileSync(filePath, cssContent, 'utf8')
        console.log(`Updated ${file}`)
    }
})

console.log('MDI cache invalidation successfully removed from CSS files!')

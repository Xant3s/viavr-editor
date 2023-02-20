const MainContentDirectory = "specifications"
const SingleVersionName = "Main Version"


$(document).ready(async () => {
    const rootFolder = getRootFolder()
    const data = await fetch(rootFolder + 'files.json')
    const files = await data.json()
    const versions = findVersions(files).reverse()
    const currentVersion = getCurrentVersion()
    insertDropDownMenu(currentVersion, files, versions)
})

function findVersions(files) {
    const versions = []
    for(const file of files) {
        const version = file.split('\\')[0]
        if (!versions.includes(version)) {
            versions.push(version)
        }
    }
    return versions
}

function getCurrentVersion() {
    const currentVersion = window.location.href.split(MainContentDirectory)[1].split('/')[1]
    return currentVersion
}

function getRootFolder() {
    const rootFolder = window.location.href.split(MainContentDirectory)[0]
    return rootFolder
}

function insertDropDownMenu(currentVersion, files, versions) {
    const availableDocHTML = 'style="color:green;"'
    let availableVersions = ""
    const currentUrl = window.location.href

    for (const version of versions) {
        const newUrl = currentUrl.replace(currentVersion, version)
        const newUrlRelative = (version + '\\' + currentUrl.substring(currentUrl.indexOf(currentVersion) + currentVersion.length + 1))
            .replaceAll('/', '\\')
        let fileExists = files.includes(newUrlRelative)
        const htmlColor = fileExists ? availableDocHTML : ''
        let firstVersionForVersion = getRootFolder() + MainContentDirectory + '/' + getFirstFileForVersion(version, files).replaceAll('\\', '/')
        const url = fileExists ? newUrl : firstVersionForVersion
        availableVersions += `<li><a ${htmlColor} href=${url}>${version}</a></li>`
    }
    const codeSnippets = document.getElementsByClassName('subnav navbar navbar-default')
    for (const element of codeSnippets) {
        element.replaceChildren(DynamicDropDownMenuHTMLCode(currentVersion ? currentVersion : SingleVersionName, availableVersions))
    }
}

function getFirstFileForVersion(version, files) {
    const filesForVersion = files.filter(file => file.startsWith(version))
    return filesForVersion[0]
}

function DynamicDropDownMenuHTMLCode(currentVersion, availableVersions) {
    return createElementFromHTML(`
    <div class="container hide-when-search" id="breadcrumb"> 
      <div class="input-prepend input-append">
        <div class="btn-group">
          <button class="btn dropdown-toggle" name="recordinput" data-toggle="dropdown">${currentVersion} <span class="caret"></span>
          </button>
            <ul class="dropdown-menu">${availableVersions}</ul> 
        </div>
      </div>
    </div>`)
}

function createElementFromHTML(htmlString) {
    const div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild
}
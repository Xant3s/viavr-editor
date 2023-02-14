const MainContentDirectory = "specifications"
const SingleVersionName = "Main Version"

$(document).ready(function()
{
  var [articlesPath, currentVersion] = SplitPath(window.location, MainContentDirectory +"/")
  var [currentVersion, subdomainPath] = SplitPath(currentVersion, "/")
  articlesPath += MainContentDirectory + "/"

  var PossibleVersions = {}
  GetDomainFolderContent(articlesPath).then(versions => 
  {
    if (articlesPath && subdomainPath)
    {
      versions.forEach(item =>
      {
        var [readableName,] = SplitPath(item, "/")
        PossibleVersions[readableName] = String(articlesPath + item + subdomainPath)
      });
      // for some reason, you can only pass a single argument to the resolve function of the promise
      CheckAsyncDomainListExists(PossibleVersions).then( domainInfo => 
        {
          let validDomainsMap = domainInfo[0] 
          let invalidVersionList = domainInfo[1]
          FindAnyFileFromVersionList(articlesPath, invalidVersionList, "/").then(anyInvalidVersionFileMap =>
            {
              let allDomains = {};
              for (const [key, value] of Object.entries(validDomainsMap)) allDomains[key] = [value, true];
              for (const [key, value] of Object.entries(anyInvalidVersionFileMap)) allDomains[key] = [value, false]
              InsertDropDownMenu(currentVersion, allDomains)
            })
        });
    }
  });

  function InsertDropDownMenu(currentVersion, foundVersions)
  {
    // Sort versions to guarantee order
    let versions = Object.entries(foundVersions);
    versions.sort((a, b) => a[0].localeCompare(b[0])).reverse();
    versions = Object.fromEntries(versions);

    const availableDocHTML = 'style="color:green;"'
    // Insert into html
    let availableVersions = "";
    for (var key in versions)
    {
      let file = versions[key][0];
      let isAvailable = versions[key][1];
      let htmlColor = isAvailable ? availableDocHTML : ''
      availableVersions += '<li><a '+ htmlColor + ' href=' + file + ">"+key+"</a></li>"
    }
    var codesnippets = document.getElementsByClassName('subnav navbar navbar-default');
    for(const element of codesnippets)
        element.replaceChildren(DynamicDropDownMenuHTMLCode(currentVersion ? currentVersion : SingleVersionName, availableVersions));
  }

  function createElementFromHTML(htmlString) 
  {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }

  function DynamicDropDownMenuHTMLCode(currentVersion, availableVersions)
  {
    return createElementFromHTML(`
    <div class="container hide-when-search" id="breadcrumb"> 
      <div class="input-prepend input-append">
        <div class="btn-group">
          <button class="btn dropdown-toggle" name="recordinput" data-toggle="dropdown">`
          + currentVersion +
          `<span class="caret"></span>
          </button>
            <ul class="dropdown-menu">`
            + availableVersions +
            `</ul> 
        </div>
      </div>
    </div>`);
  }

 
  

  // Splits the string at the first occurrence, removes delimeter from substrings
  function SplitPath(inputString, delimter)
  {
    inputString = String(inputString)
    var index = inputString.indexOf(delimter);
    if (index >= 0) {
      var left = inputString.substring(0, index);
      var right = inputString.substring(index + String(delimter).length, inputString.length);
      return [left,right]
    }
    return [];
  }

  function FindAnyFileFromVersionList(articlesPath, versionList, appendChar = "")
  {
    var promises = [];
    var foundFiles = {};
    for (let i in versionList)
    {
      promises.push(new Promise(resolve => FindAnyFileFromVersion(articlesPath + versionList[i] + appendChar).then(foundPath =>
        {
          if (foundPath)
          {
            foundFiles[versionList[i]] = foundPath;
          }
          resolve()
        })))
    }
    return new Promise(onFoundFiles =>
      {
        Promise.all(promises).then( resolved =>
          {
            onFoundFiles(foundFiles);
          })
      });
  }

  function FindAnyFileFromVersion(absoluteVersionPath)
  {
    return new Promise(foundPath =>
      {
        GetDomainFolderContent(absoluteVersionPath).then(topics =>
          {
            if(topics.length == 0)
            {
              foundPath();
            }
            else 
            {
              let topicsPath = absoluteVersionPath + topics[0];
              GetDomainFolderContent(topicsPath).then(foundFiles =>
                {
                  if(foundFiles.length == 0)
                  {
                    foundPath();
                  }
                  else 
                  {
                    foundPath(absoluteVersionPath + topics[0] + foundFiles[0]);
                  }
                })
            }
          })
      });
  }

  function CheckAsyncDomainListExists(domainMap)
  {
    var validDomainsMap = {}
    var invalidDomainsList = []
    var promises = []
    for (let [key, value] of Object.entries(domainMap))
    {
      promises.push(new Promise(resolve =>
        {
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', value, true);
          xhr.onreadystatechange = function() 
          {
            if (xhr.readyState === 4) 
            {
              if (xhr.status === 200) 
              {
                validDomainsMap[key] = value;
              }
              else
              {
                invalidDomainsList.push(key);
              }
              resolve()
            }
          }
          xhr.send();
        }
        ))
    }

    return new Promise(resolve =>
      {
        Promise.all(promises).then( function(resolvedDomains)
        {
          resolve([validDomainsMap, invalidDomainsList]);
        })
      });
  }

  function GetDomainFolderContent(absoluteDomain)
  {
    return new Promise(resolve => 
      {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', absoluteDomain, true);
        xhr.onreadystatechange = function() 
        {
          var fileNames = [];
          if (xhr.readyState === 4) 
          {
            if(xhr.status === 200)
            {
              var parser = new DOMParser();
              var doc = parser.parseFromString(xhr.responseText, "text/html");
              // Only content of tbody references folders and documents
              var links = doc.getElementsByTagName("tbody")[0].getElementsByTagName("a");
              for (var i = 0; i < links.length; i++) 
              {
                fileNames.push(links[i].text);
              }
            }
            resolve(fileNames)
          }
        }
        xhr.send();
      });
  };
})
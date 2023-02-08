const MainContentDirectory = "specifications"
const SingleVersionName = "Main Version"

$(document).ready(function()
{
  var [articlesPath, currentVersion] = SplitPath(window.location, MainContentDirectory +"/")
  var [currentVersion, subdomainPath] = SplitPath(currentVersion, "/")
  articlesPath += MainContentDirectory + "/"

  var PossibleVersions = {}
  GetArticleFilesFromFolder("/" + MainContentDirectory).then(versions => 
  {
    if (articlesPath && subdomainPath)
    {
      versions.forEach(item =>
      {
        var [readableName,] = SplitPath(item, "/")
        PossibleVersions[readableName] = String(articlesPath + item + subdomainPath)
      });
      CheckAsyncDomainListExists(PossibleVersions).then(content => InsertDropDownMenu(currentVersion, content))
    }
  });

  function InsertDropDownMenu(currentVersion, foundVersions)
  {
    // Sort versions to guarantee order
    let versions = Object.entries(foundVersions);
    versions.sort((a, b) => a[0].localeCompare(b[0]));
    foundVersions = Object.fromEntries(versions);

    // Insert into html
    availableVersions = "";
    for (var key in foundVersions)
    {
      availableVersions += "<li><a href="+ foundVersions[key] + ">"+key+"</a></li>"
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

  function CheckAsyncDomainListExists(domainMap)
  {
    var validDomains = {}
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
                validDomains[key] = value;
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
          resolve(validDomains);
        })
      });
  }

  
  function GetArticleFilesFromFolder(relativePath, onReadyFunc)
  {
    return new Promise(resolve => 
      {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.origin + relativePath, true);
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
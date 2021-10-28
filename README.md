`Please edit this README to fit your project and keep it up-to-date with your concept.`

`All final deliverables (code, executable, report, presentations) have to be committed, tagged as final and pushed to your GitLab repository.`

# Games Engineering Project Repository

|  General Info  | |
| ---|---|
| Working Title | `Edit me!` |
| Final Title | `Edit me!` |
| Student | `Name`, `edit-me`@stud-mail.uni-wuerzburg.de|
| Target Platform(s) | `Edit me!` |
| Start Date | `Edit me!` |
| Study Program | `Edit me!` |

### Abstract

`Insert your project description here, and keep it up-to-date.`

`------ READ, THEN REPLACE WITH CUSTOM CONTENT BELOW HERE ------`

## Repository Usage Guides

```
RepositoryRoot/
    ├── README.md           
    ├── builds/             // Archives (.zip) of built executables of your projects
    │                       //  including (non-standard) dependencies
    ├── code/
    │   ├── engine/         // Place your project folder(s) here
    │   ├── my-game-1/      // No un-used folders, no "archived" folders
    │   ├── CMakeLists.txt  // e.g. if using CMake, this can be your project root
    │   └── ...
    └── report/             // PDF
    └── presentation/       // pptx etc
```

### Project and Source Control

Read more about Git in the [Atlassian Git Tutorials](https://de.atlassian.com/git).

#### Avoiding Clutter with .gitignore
Gitignore files allow to exclude certain patterns from being versioned.
This is necessary to avoid unnecessary (and possibly harmful) cluttering of your repository.
Especially the automatically generated project and cache files of VisualStudio, Unity, or Unreal projects should be ignored.

You can find [a selection of *.gitignore* files publicly available on GitHub](https://github.com/github/gitignore).

##### Quick Check if .gitignore is working

Your *.gitignore* is not correctly set up, if
* your repository contains Folders such as `Library`, `DerivedDataCache` or `Saved`
* `cache` files, `visual studio` project files etc. are `shown as modified` before commiting with your git client

In this case, check your setup.
Be aware that *.gitignore* is the actual, required filename!

#### Versioning Binary Assets with Git LFS and .gitattributes
Gitattribute files define file types to be handled through the Git Large File Storage (Git LFS) System.
This system does not handle binary files, such as assets, images, meshes, etc. well.
Even minimal changes add the whole file to the projects history.
Git LFS identifies iterations of binary files using a hash in the repository, but stores the actual binary data transparently in a seperate data silo.

To let Git LFS track a certain file (e.g. recursively all *.jpg*), execute this command:

	> git lfs track *.jpg

This command creates the following entry in the *.gitattributes* file:

	*.jpg filter=lfs diff=lfs merge=lfs -text

Git LFS is installed on all Workstations in E37 and the GameLabs.
For your private computer, you can [download Git LFS here](https://git-lfs.github.com/).

#### Further Reading: 
* [Epic on Git for Unreal](https://wiki.unrealengine.com/Git_source_control_(Tutorial)#Workarounds_for_dealing_with_binary_files_on_your_Git_repository)
* [GitLFS](https://www.git-lfs.com)
* [Git](https://www.git-scm.com)


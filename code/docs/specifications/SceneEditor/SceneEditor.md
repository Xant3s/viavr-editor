# Drag & Snap Editor

The VIA-VR drag & snap editor is based on [Mozilla Spoke](https://hubs.mozilla.com/spoke). This page explains how Spoke is currently embedded and how the editor can be extended or modified. It also discusses possible future strategies to extend the editor. To learn how to use the Spoke editor, please consult the [Spoke user documentation](https://hubs.mozilla.com/docs/spoke-creating-projects.html).

<div class="IMPORTANT">
  <h5>CAUTION</h5>
  <p>This page describes the status quo. It is likely that some things will change a lot.</p>
</div>

## Software Architecture

To learn about Spoke's architecture, please read the [Spoke developer documentation](https://github.com/mozilla/Spoke/blob/master/docs/README.md) and [Hubs developer documentation](https://hubs.mozilla.com/docs/system-overview.html).

![](images/Processes.png)

Spoke is - like e.g. Unity - an independent process running on the same machine as the VIA-VR editor. Spoke version 0.8.6 ([8aa84fce](https://github.com/mozilla/Spoke/commit/8aa84fce7d0ae8c46a4626767884cfb3aa0578d1)) is included in the VIA-VR editor install directory. Currently, Spoke always runs in develop mode. [Future work #23](https://gitlab2.informatik.uni-wuerzburg.de/GE/Teaching/grl/2021-truman-viavr-editor/-/issues/23) describes the feature to run Spoke in production mode.
The SpokeManager system manages the lifetime of the Spoke process. It starts Spoke when the VIA-VR editor is started, and stops Spoke when the VIA-VR editor is stopped. If the `dev-stopSpoke` preference is set to false, the Spoke process is not stopped when the VIA-VR editor is stopped. The Spoke process can then be reused, which saves a considerable amount of time when the VIA-VR editor is started again. The `dev-stopSpoke` preference only works in develop mode.

When started, Spoke is served at `https://localhost:9090`. Spoke is embedded in the `Editor` component using an [inline frame element](https://localhost:9090). To bypass cross-origin restrictions both when accessing the Spoke DOM and accessing remote content like Sketchfab, a custom certificate verification procedure is used. This procedure allows access the `localhost` domain and uses the Chromium default verification procedure for all other domains. See [Electron documentation](https://www.electronjs.org/docs/latest/api/session#sessetcertificateverifyprocproc) for further info. [Future work #19](https://gitlab2.informatik.uni-wuerzburg.de/GE/Teaching/grl/2021-truman-viavr-editor/-/issues/19) and [future work #30](https://gitlab2.informatik.uni-wuerzburg.de/GE/Teaching/grl/2021-truman-viavr-editor/-/issues/30) discuss the need for hardening.

<!-- 
- accessed through Spoke utility functions etc see below
- advantages: independence, low knowledge required
 -->




<!-- How to change Spoke UI and react to events -->
<!-- example: how to modify UI -->
<!-- example: how to react on button click -->
<!-- example: how to query current page -->
<!-- planned: events, e.g. on project loaded etc -->

<!-- Method 1: how it's used right now -->

<!-- Method 2: directly modify Spoke, perhaps in combination w/ Method 1 -->

<!-- Method 3: render on top/overlay, not sure if feasible, still need to react to Spoke events -->

<!-- Future: investigate Hubs Cloud, might be useful to save/load projects
https://hubs.mozilla.com/docs/hubs-cloud-intro.html

Future: build Spoke, also makes it easier to modify Spoke components directly by modifying the Spoke src code
 -->

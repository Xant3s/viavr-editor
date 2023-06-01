import { $$, htmlElement } from './Spoke'
import { toaster } from 'evergreen-ui'


export class SceneExport {

    constructor() {
        api.on('spoke:export-scene', async () => {
            await Promise.all([
                this.exportSceneAsGlb(),
                this.exportSceneAsJson(),
            ]);
            toaster.success('Scene has been saved successfully', { duration: 10 });
        });
    }

    private checkTextExists(resolve) {
        if ($$('span:contains("Exporting Scene..."):last').length > 0) {
            // Text exists
            setTimeout(this.checkTextExists.bind(this, resolve), 500);
            // Poll again after a delay
        } else {
            resolve(); // Resolve the promise when the text is no longer present
        }
    }

    private async exportSceneAsGlb() {
        const exportSceneButton = $$('div:contains("Export as binary glTF"):last');
        exportSceneButton.hide();
        exportSceneButton.trigger('click');
        const exportButton = await htmlElement('button:contains("Export Project"):last');
        await this.handleExportOptionsDialog(exportButton);
    }

    private async handleExportOptionsDialog(exportProjectBtn) {
        exportProjectBtn.closest('form').hide();
        exportProjectBtn.trigger('click');
        const dialogTitle = await htmlElement('span:contains("Exporting Project"):last');
        dialogTitle.text('Exporting Scene...');
        const textForChecking = $$('div:contains("project"):last');
        textForChecking.text('Exporting scene...');
        return new Promise((resolve) => {
            this.checkTextExists(resolve);
        });
    }

    private async exportSceneAsJson() {
        const exportSceneButton = $$('div:contains("Export legacy"):last');
        exportSceneButton.hide();
        exportSceneButton.trigger('click');
    }
}

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)
FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidthÇ: 100,
    imageResizeTargetHeight: 150	
})

FilePond.parse(document.body);
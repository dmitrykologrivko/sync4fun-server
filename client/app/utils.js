import $ from 'jquery';

export function convertBytesToMegabytes(bytes = 0) {
    return bytes / 1024 / 1024;
}

export function checkFilesEquals(file1, file2) {
    const exp = /\.[a-zA-Z0-9]+$/;

    if (exp.exec(file1.name)[0] !== exp.exec(file2.name)[0])
        return false;

    if (file1.size !== file2.size)
        return false;

    return true;
}

export function copyToClipboard(text) {
    const dummy = $('<input>').val(text).appendTo('body').select();

    document.execCommand('copy');

    dummy.remove();
}

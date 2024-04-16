// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"

import $ from "jquery";
window.jQuery = $;
window.$ = $;

console.log("Hello lovely...")

// Import TinyMCE
import tinymce from 'tinymce/tinymce';
// Import any plugins you might need
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/link';

// Initialize TinyMCE on any textarea with a specific class or ID
document.addEventListener('DOMContentLoaded', () => {
  tinymce.init({
    selector: '.tinymce', // Adjust this selector to target the textarea(s)
    plugins: 'paste link', // List plugins you want to use
    toolbar: 'undo redo | styleselect | bold italic | link image',
    menubar: 'file edit view insert format tools table help',
  });
});


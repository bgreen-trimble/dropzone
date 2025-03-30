# Drop Zone

This application demonstrates how to capture images from a drag and drop, file upload and the clipboard. There is also an option to enter a URL.

Each method uses a different interface to extract data which may contain an image. The code parses that data to find potential images. There may be multiple images in the data. There may be duplicates.

Not all discovered images can be retrieved. If the image identified by a URL, the host may prevent its download by denying a cross-origin resource sharing (CORS) request or missing authorization.

Not all methods may succeed on the same source. Often drag and drop may fail where copy and paste succeeds.

## MIME Type

By convention drag and drop, and clipboard data are identified using MIME types. Their data is in the form of key/value pairs. The MIME type is the key.

MIME types, also called "media types" or "content type", are strings that identify the format of a file, like *image/jpeg* or *text/html*. They assist browsers and applications to determine how to handle the data.

### Text MIME Types

|MIME Type|Description|
|---------|-----------|
|text/html|HTML documents|
|text/plain|Plain Text|
|text/uri-list|Plain Text|

### text/html

The *text/html* MIME type indicates that the presence of HyperText Markup Language (HTML) source code, which is used to structure and display web pages.

**Format:**

HTML is the de facto markup language used to build web pages.

**Parsing:**

*text/html* may contain an image URL. Image URLs can be found a source attributes to style attributes. If one is found and it ends with an known image extension then it is added to be list of potential images.

Here are some examples of *text/html*:

``` html
<meta charset="utf-8"><img src="https://s7d1.scene7.com/is/image/scom/CTK_default_nav-4?$450j$" alt="Crosstrek 2025">
```

``` html
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><img id="rimg_98noZ_TOCP3_ptQPq7in6Ao_1" src="data:image/png;base64,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" alt="What is CORS. Part 1 | by Rafael Salvador Valdez | Medium" class="IOZdEc mNbAre" data-csiid="98noZ_TOCP3_ptQPq7in6Ao_1" data-atf="1">
```

### text/plain

The *text/plain* MIME type signifies that the content is a simple, human-readable text.

**Format:**

While *text/plain* is the default for text, it's not meant to indicate a specific type of text format like CSS, JavaScript, or HTML.

**Parsing:**

*text/plain* may contain an image URL. If one is found and it ends with an known image extension then it is added to be list of potential images.

Here are some examples of *text/plain*:

``` text
https://media.istockphoto.com/id/2173983605/photo/modern-living-room-interior-with-christmas-tree-gift-boxes-ornaments-armchair-and-fireplace.webp?b=1&s=612x612&w=0&k=20&c=d2L72I6dOmsVykEQzSPToU2gjwyNMw5M8zN0B-yhHkk=
```

### text/uri-list

*text/uri-list* provides a straightforward way to transmit or store lists of URIs, allowing applications to easily parse and process them.

**Format:**

- Each URI should be on a separate line.
- Comments can be included by starting a line with the '#' character (unless the '#' character is part of the URI).
- Content-transfer-encodings may be used to enforce line length limitations.

*Browsers will strip out line feeds and concatenate the lines into one.*

**Example:**

``` text
http://www.example.com/image1.jpg
https://www.example.org/document.pdf
# This is a comment
ftp://user:password@archive.example.net/backup.tar.gz
```

**Parsing:**

*text/uri-list* may contain an image URL. If one is found and it ends with an known image extension then it is added to be list of potential images.

Here are some examples of *text/uri-list*:

``` text
data:image/webp;base64,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
```

``` text
https://m.media-amazon.com/images/S/aplus-media-library-service-media/b46681ec-bc1b-46b4-8d29-386fe391bbf1.__CR0,0,600,180_PT0_SX600_V1___.png
```

### Image MIME Types

|MIME Type|Description|
|---------|-----------|
|image/gif|Graphics Interchange Format|
|image/jpeg|Joint Photographic Expert Group image|
|image/jpg|Joint Photographic Expert Group image|
|image/png|Portable Network Graphics|
|image/webp|Web Picture format|

The image MIME type identifies the format of an image, such as *image/jpeg* for JPEG images, or *image/png* for PNG images.

Normally when an image MIME type appears its data value is a BLOB object (raw data) containing the contents of the image.

Usually, an image MIME type only appears when it is copied from the clipboard.

### Special case of File (files)

When files from the computer's file system are dropped a MIME type is not used. Instead the *Files* or *files* is used to identify the data.

## Data Sources

### HTML Drag and Drop API

The [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) enables web applications to implement drag-and-drop functionality, allowing users to click and hold on an element, drag it to a different location, and release to drop it there.

For detecting and handling images from drag and drop operations, the application needs to:

1. Set up event listeners for the drag events (`dragenter`, `dragover`, `drop`)
2. Prevent default behaviors that might interfere with the custom handling
3. Examine the `dataTransfer` object in the drop event to extract data
4. Process different MIME types that might contain image data or references

When processing the dropped data, the application examines the available formats through `dataTransfer.types` and extracts data according to the MIME types present. The dropped data is effectively a list of key/value pairs where the key is MIME type.

The user may select draggable elements with a mouse, drag those elements to a droppable element, and drop them by releasing the mouse button. A translucent representation of the draggable elements follows the pointer during the drag operation.

Here is an example of Drag and Drop data:

``` text
text/uri-list: https://www.amazon.com/dp/B0DJG5WPP5/ref=mes-dp?_encoding=UTF8&pd_rd_w=BLx3y&content-id=amzn1.sym.8572ac08-6096-4eb6-b32e-2c759cc3eb5b&pf_rd_p=8572ac08-6096-4eb6-b32e-2c759cc3eb5b&pf_rd_r=F0BH83H9ZPQV31KAX5CR&pd_rd_wg=mHcRw&pd_rd_r=17c0f5c7-d222-4fc5-aeb8-e09d7c11b07c
text/html: <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"><img alt="Devil's Detail: A World War 3 Techno-Thriller Action Event (Nick Ryan's World War 3 Military Fiction Technothrillers)" src="https://m.media-amazon.com/images/I/51uEBckEiiL._UX300_PJku-sticker-v8%2CTopRight%2C0%2C-50_.jpg" aria-hidden="true" class="a-thumbnail-left _mes-dp_styles_bookCover__tE7YN">
```


## Noteworthy

The application focuses on retrieving images from another browser and the file system. While drag and drop, and clipboard data can originate from an application other then a browser the application is not designed to support those. Often those applications use a MIME type not supported by the application.

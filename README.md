# HtmlMail2Pdf-Infinite

To Convert the .html Mails i'm downloading from my overflowing mailbox into infinitely long pdfs without page break fails in the layout.

## Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)

## Install Dependencies

Before using the project, install the required packages and browsers:

- npm install playwright
- npx playwright install

## SendTo Helper Script

The file `Html2Pdf-Infinite.bat` inside the `scripts` folder can be used to send HTML files to the application via **Windows right-click menu**.  
Place it into your SendTo Folder: C:\Users\User\AppData\Roaming\Microsoft\Windows\SendTo  
Adjust the path inside of it to the path you downloaded the app to e.g.: pushd "C:\Users\User\Apps\Html2PdfInfinite\html-2-pdf-infinite"  
Right click the Html file > Show more options > Send to > Html2Pdf-Infinite.bat  
The script will process the HTML and perform the conversion.  
The PDF file will appear in the same folder the html is you clicked.  

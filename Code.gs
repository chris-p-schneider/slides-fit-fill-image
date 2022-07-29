//////////////////////////////////////////////////////////////////////////////////////////////////////
// Container-Bound Script for Test Presentation
//////////////////////////////////////////////////////////////////////////////////////////////////////

// create ui on slides opening
function onOpen(e) {
    SlidesApp.getUi()
    .createMenu("Fit/Fill Image to Slides")
    .addItem("├┼┼┤ Open Preview", "openDialog")
    .addSeparator()
    .addItem("║☐║ Fit Image", "runFitImage")
    .addSeparator()
    .addItem("║⌧║ Fill Image", "runFillImage")
    .addSeparator()
    .addItem("║▯▯║ Fill Portait Images", "runFillPortraitImages")
    .addSeparator()
    .addItem("║▭║ Fill Landscape Images", "runFillLandscapeImages")
    .addSeparator()
    .addItem("║⊞║ Fill Quarter Images", "runFillQuarterImages")
    .addToUi();  
}

// create ui on install
function onInstall(e) {
  onOpen(e);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// User interface functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// create the modal ui
function openDialog() {
  var ui = HtmlService
    .createTemplateFromFile('Modal')
    .evaluate()
    .setWidth(750)
    .setHeight(350);
  var currentState = getCurrentState();
  if (currentState.validImage) {
    SlidesApp.getUi().showModalDialog(ui, "Fit/Fill Image to Slides 📐");
  }
}

// add the css/js to main html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// pass the image content url to the html preview
function sendImageUrl() {
  
  var currentState = getCurrentState();
  
  if (currentState.validImage) {    
    return currentState.userSelectionImage.asImage().getContentUrl();
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Run functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// runs full image fit process (no crop)
function runFitImage(boolNewSlide) {
  var currentState = getCurrentState();
  if (currentState.validImage) {
    var image = currentState.userSelectionImage.asImage();
    fitImage(boolNewSlide, image, currentState.pageHeight, currentState.pageWidth);
  }
}

// runs full image fill process (with crop)
function runFillImage(boolNewSlide) {
  var currentState = getCurrentState();
  if (currentState.validImage) {
    var image = currentState.userSelectionImage.asImage();
    fillImage(boolNewSlide, image, currentState.pageHeight, currentState.pageWidth);
  }
}

// runs portrait image fit process
function runFillPortraitImages(boolNewSlide, index) {
  var currentState = getCurrentState();
  if (currentState.validImage) {
    var image = currentState.userSelectionImage.asImage();
    fillPortaitImage(boolNewSlide, index, image, currentState.pageHeight, currentState.pageWidth);
  }
}

// runs landscape image fit process
function runFillLandscapeImages(boolNewSlide, index) {
  var currentState = getCurrentState();
  if (currentState.validImage) {
    var image = currentState.userSelectionImage.asImage();
    fillLandscapeImage(boolNewSlide, index, image, currentState.pageHeight, currentState.pageWidth);
  }
}

// runs quarter image fit process
function runFillQuarterImages(boolNewSlide, index) {
  var currentState = getCurrentState();
  if (currentState.validImage) {
    var image = currentState.userSelectionImage.asImage();
    fillQuarterImage(boolNewSlide, index, image, currentState.pageHeight, currentState.pageWidth);
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// Preparation functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// get and return current state object
function getCurrentState() {
  
  var currentState = {
    activePresentation: SlidesApp.getActivePresentation(),
    pageHeight: SlidesApp.getActivePresentation().getPageHeight(), // returns value in points, not pixels
    pageWidth: SlidesApp.getActivePresentation().getPageWidth(),   // still valid for calculating ratios
    userSelection: SlidesApp.getActivePresentation().getSelection(),
    userSelectionType: SlidesApp.getActivePresentation().getSelection().getSelectionType()
  };

  if (currentState.userSelectionType == 'PAGE_ELEMENT') { // don't attempt non-page elements
    Logger.log("currentState.userSelectionType == 'PAGE_ELEMENT'");
    currentState.userSelectionRangeElements = SlidesApp.getActivePresentation().getSelection().getPageElementRange().getPageElements();
    currentState.userSelectionImage = SlidesApp.getActivePresentation().getSelection().getPageElementRange().getPageElements()[0];
    currentState.validImage = true;
  } 
  else {
    currentState.validImage = false;
    // SlidesApp.getUi().alert("Invalid Selection!"); // testing
  }

  Logger.log("1 - Active presentation: " + currentState.activePresentation);                     // Presentation
  Logger.log("2 - Page height: " + currentState.pageHeight);                                     // 405
  Logger.log("3 - Page width: " + currentState.pageWidth);                                       // 720
  Logger.log("4 - User selection: " + currentState.userSelection);                               // Selection
  Logger.log("5 - User selection type: " + currentState.userSelectionType);                      // PAGE_ELEMENT
  Logger.log("6 - User selection range elements: " + currentState.userSelectionRangeElements);   // PageElement
  Logger.log("7 - User selection image: " + currentState.userSelectionImage);                    // 
  Logger.log("8 - Valid image: " + currentState.validImage);                                     // true | false

  return currentState;
}

// returns an object with image and slide info
function getImageInfo(image, pageHeight, pageWidth) {

  var imageInfo = {
    imageLeft: image.getLeft(),
    imageTop: image.getTop(),
    imageHeight: image.getHeight(),
    imageWidth: image.getWidth(),
    heightRatio: pageHeight / image.getHeight(),
    testWidth: image.getWidth() * (pageHeight / image.getHeight()),
    widthRatio: pageWidth / image.getWidth(),
    newHeight: image.getHeight() * (pageWidth / image.getWidth())
  };

  Logger.log("Image Left: " + imageInfo.imageLeft);
  Logger.log("Image Top: " + imageInfo.imageTop);
  Logger.log("Image Height: " + imageInfo.imageHeight);
  Logger.log("Image Width: " + imageInfo.imageWidth);
  Logger.log("Page Height: " + pageHeight);
  Logger.log("Page Width: " + pageWidth);
  Logger.log("Height Ratio: " + imageInfo.heightRatio);
  Logger.log("Test Width: " + imageInfo.testWidth);
  Logger.log("Width Ratio: " + imageInfo.widthRatio);
  Logger.log("New Height: " + imageInfo.newHeight);

  return imageInfo;
}

// returns selected image to original location and size
function restoreImage(image, imageInfo) {

  image.setLeft(imageInfo.imageLeft);
  image.setTop(imageInfo.imageTop);
  image.setWidth(imageInfo.imageWidth);
  image.setHeight(imageInfo.imageHeight);

}

// inserts transformed image to new slide
function imageToNewSlide(image, imageInfo) {

  var currentSlide = image.getParentPage().asSlide();
  var newSlide = currentSlide.duplicate();
  
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Fill/Fit Image to Slides functions
//////////////////////////////////////////////////////////////////////////////////////////////////////

// fits the image to maximum size on slide without cropping
function fitImage(boolNewSlide, image, pageHeight, pageWidth) {

  var imageInfo = getImageInfo(image, pageHeight, pageWidth);

  // image.alignOnPage(SlidesApp.AlignmentPosition.CENTER);

  if (imageInfo.testWidth < pageWidth) { // valid fit to max height
      image.setHeight(pageHeight);
      image.setWidth(imageInfo.testWidth);
  } 
  else if (imageInfo.testWidth > pageHeight) { // invalid fit to max height; fit instead to width 
    image.setWidth(pageWidth);
    image.setHeight(imageInfo.newHeight);
  } 
  else {
    SlidesApp.getUi().alert("Unexpected Fit Error.");
  }

  image.alignOnPage(SlidesApp.AlignmentPosition.CENTER);

  if (boolNewSlide) {
    imageToNewSlide(image, imageInfo);
    restoreImage(image, imageInfo);
  }
}

// fills the image to the entire slide with cropping
function fillImage(boolNewSlide, image, pageHeight, pageWidth) {
  
  var imageInfo = getImageInfo(image, pageHeight, pageWidth);
  var temporaryImage = image.duplicate(); // image to fill slide and replace with cropped blob

  if (boolNewSlide) {
    imageToNewSlide(image, imageInfo);    
  }
  image.alignOnPage(SlidesApp.AlignmentPosition.CENTER);

  temporaryImage.setWidth(pageWidth);
  temporaryImage.setHeight(pageHeight);
  temporaryImage.alignOnPage(SlidesApp.AlignmentPosition.CENTER);

  if (imageInfo.testWidth < pageWidth) { // portrait images
    image.setWidth(pageWidth);
    image.setHeight(imageInfo.newHeight);
    image.alignOnPage(SlidesApp.AlignmentPosition.CENTER);
    // CROP TOP AND BOTTOM
  }
  else if (imageInfo.testWidth > pageWidth) { // landscape images
    image.setHeight(pageHeight);
    image.setWidth(imageInfo.testWidth);
    // CROP LEFT AND RIGHT
  }
  else {
    SlidesApp.getUi().alert("Unexpected Fill Error.");
  }

  temporaryImage.asImage().replace(image.getBlob(), true);
  image.remove();

}

// fill the image to a portrait half
function fillPortaitImage(boolNewSlide, index, image, pageHeight, pageWidth) {
  
  if (boolNewSlide) {
    imageToNewSlide(image, imageInfo);    
  }

  var imageInfo = getImageInfo(image, pageHeight, pageWidth);
  var temporaryImage = image.duplicate(); // image to fill slide and replace with cropped blob

  temporaryImage.setWidth(pageWidth / 2); // half of slide width
  temporaryImage.setHeight(pageHeight);
  temporaryImage.alignOnPage(SlidesApp.AlignmentPosition.CENTER);

  if (imageInfo.testWidth < pageWidth) { // portrait images
    image.setWidth(pageWidth);
    image.setHeight(imageInfo.newHeight);
    image.alignOnPage(SlidesApp.AlignmentPosition.CENTER);
    // CROP TOP AND BOTTOM
  }
  else if (imageInfo.testWidth > pageWidth) { // landscape images
    image.setHeight(pageHeight);
    image.setWidth(imageInfo.testWidth);
    // CROP LEFT AND RIGHT
  }
  else {
    SlidesApp.getUi().alert("Unexpected Fill Error.");
  }

  temporaryImage.asImage().replace(image.getBlob(), true);
  image.remove();
  temporaryImage.setLeft(0);

  var secondImage = temporaryImage.duplicate();
  secondImage.setLeft(temporaryImage.getWidth());

  if (index == 2) {
    secondImage.remove();
  }
  else if (index == 3) {
    temporaryImage.remove();
  }
  // if no or larger index given, keep both
}

// fill the image to a landscape half
function fillLandscapeImage(boolNewSlide, index, image, pageHeight, pageWidth) {
  
  if (boolNewSlide) {
    imageToNewSlide(image, imageInfo);    
  }

  var imageInfo = getImageInfo(image, pageHeight, pageWidth);
  var temporaryImage = image.duplicate(); // image to fill slide and replace with cropped blob

  temporaryImage.setWidth(pageWidth); 
  temporaryImage.setHeight(pageHeight / 2); // half of slide height
  temporaryImage.alignOnPage(SlidesApp.AlignmentPosition.CENTER);

  if (imageInfo.testWidth < pageWidth) { // portrait images
    image.setWidth(pageWidth);
    image.setHeight(imageInfo.newHeight);
    image.alignOnPage(SlidesApp.AlignmentPosition.CENTER);
    // CROP TOP AND BOTTOM
  }
  else if (imageInfo.testWidth > pageWidth) { // landscape images
    image.setHeight(pageHeight);
    image.setWidth(imageInfo.testWidth);
    // CROP LEFT AND RIGHT
  }
  else {
    SlidesApp.getUi().alert("Unexpected Fill Error.");
  }

  temporaryImage.asImage().replace(image.getBlob(), true);
  image.remove();
  temporaryImage.setTop(0);

  var secondImage = temporaryImage.duplicate();
  secondImage.setTop(temporaryImage.getHeight());

  if (index == 4) {
    secondImage.remove();
  }
  else if (index == 5) {
    temporaryImage.remove();
  }
  // if no or larger index given, keep both
}

// fill the image to a quarter
function fillQuarterImage(boolNewSlide, index, image, pageHeight, pageWidth) {
  
  if (boolNewSlide) {
    imageToNewSlide(image, imageInfo);    
  }

  var imageInfo = getImageInfo(image, pageHeight, pageWidth);
  var temporaryImage = image.duplicate(); // image to fill slide and replace with cropped blob

  temporaryImage.setWidth(pageWidth); // crop to full size first
  temporaryImage.setHeight(pageHeight);
  temporaryImage.alignOnPage(SlidesApp.AlignmentPosition.CENTER);

  if (imageInfo.testWidth < pageWidth) { // portrait images
    image.setWidth(pageWidth);
    image.setHeight(imageInfo.newHeight);
    image.alignOnPage(SlidesApp.AlignmentPosition.CENTER);
    // CROP TOP AND BOTTOM
  }
  else if (imageInfo.testWidth > pageWidth) { // landscape images
    image.setHeight(pageHeight);
    image.setWidth(imageInfo.testWidth);
    // CROP LEFT AND RIGHT
  }
  else {
    SlidesApp.getUi().alert("Unexpected Fill Error.");
  }

  temporaryImage.asImage().replace(image.getBlob(), true);
  image.remove();

  temporaryImage.setWidth(pageWidth / 2);         // reduce to 1/4 slide
  temporaryImage.setHeight(pageHeight / 2);
  temporaryImage.setTop(0).setLeft(0);            // top left

  var imageQuarter2 = temporaryImage.duplicate(); // top right
  var imageQuarter3 = temporaryImage.duplicate(); // bottom left
  var imageQuarter4 = temporaryImage.duplicate(); // bottom right
  
  imageQuarter2.setLeft(temporaryImage.getWidth());
  imageQuarter3.setTop(temporaryImage.getHeight());
  imageQuarter4.setLeft(temporaryImage.getWidth()).setTop(temporaryImage.getHeight());
  
  if (index == 6) {
    imageQuarter2.remove();
    imageQuarter3.remove();
    imageQuarter4.remove();
  }
  else if (index == 7) {
    temporaryImage.remove();
    imageQuarter3.remove();
    imageQuarter4.remove();
  }
  else if (index == 8) {
    temporaryImage.remove();
    imageQuarter2.remove();
    imageQuarter4.remove();
  }
  else if (index == 9) {
    temporaryImage.remove();
    imageQuarter2.remove();
    imageQuarter3.remove();
  }
  // if no or larger index given, keep both
}

// align image to a side of the slide
//














//////////////////////////////////////////////////////////////////////////////////////////////////////
//Change the size of a file
//var file = fileInput.files[0];  fd.append(filename, result, resultPropName, filename + ".png");
export default function resizeImage (imageFile, imageSizeX) {
  return new Promise((resolve, reject) => {
    if (imageFile.type.match(/image.*/)) {
      const reader = new FileReader();
      reader.onload = function() {
        // Create a new image.
        const img = new Image();
        // Set the img src property using the data URL.
        img.src = reader.result;
        img.onload = function() {
          const image=this;
          const max_width=imageSizeX;
          let width = image.width;
          let height = image.height;
          
          if (width > max_width) {
            height *= max_width / width;
            width = max_width;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          
          resolve(dataURLtoBlob(canvas.toDataURL("image/png")));

          function dataURLtoBlob(dataURL) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            let byteString;
            if (dataURL.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURL.split(",")[1]);
            else byteString = unescape(dataURL.split(",")[1]);
            // separate out the mime component
            const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
            // write the bytes of the string to a typed array
            const ia = new Uint8Array(byteString.length);
            for (const i of Object.keys(byteString)) {
              ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {type:mimeString});
          }
        };
      }
      reader.readAsDataURL(imageFile); 
    }
    else {
      throw new Error("image type not supported");
    }
  });
}
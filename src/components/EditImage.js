// import React, { useEffect, useRef } from 'react';
// import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';

// function EditImage({ imageUrl }) {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Create a new Fabric.js canvas
//     const canvas = new FabricCanvas(canvasRef.current, {
//       width: 800,
//       height: 600,
//       backgroundColor: '#f3f3f3',
//     });

//     // Load and add the image to the canvas
//     FabricImage.fromURL(imageUrl, (img) => {
//       img.set({
//         left: 100,
//         top: 100,
//         scaleX: 0.5, // Adjust scale based on the image size
//         scaleY: 0.5,
//         hasControls: true,
//         hasBorders: true,
//         selectable: true,
//       });
//       canvas.add(img);
//       canvas.renderAll(); // Ensure the canvas is updated after adding the image
//     });

//     // Cleanup the canvas when component unmounts
//     return () => {
//       canvas.dispose();
//     };
//   }, [imageUrl]);

//   return (
//     <div className="p-4 max-w-md mx-auto border rounded-lg">
//       <h2 className="text-2xl font-semibold mb-4">Edit Your Image</h2>
//       <canvas ref={canvasRef}></canvas>
//     </div>
//   );
// }

// export default EditImage;

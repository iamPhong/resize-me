import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { useDropzone } from 'react-dropzone';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';

function App() {
  const [capacity, setCapacity] = useState(0);
  const [file, setFile] = useState(null);
  const [outputImage, setOutputImage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showResizeButton, setShowResizeButton] = useState(true);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const handleCapacityChange = (e) => {
    setCapacity(parseInt(e.target.value));
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setOutputImage('');
    setShowResizeButton(true);
    setShowDownloadButton(false);
  };

  const resizeImage = () => {
    if (!file) {
      alert('Please choose an image file.');
      return;
    }

    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataURL = event.target.result;
      const paddingSize = capacity - file.size;

      // Create padding based on capacity and file size
      const padding = new Array(paddingSize).fill('a').join('');

      // Append padding to the data URL
      const paddedDataURL = dataURL + btoa(padding);

      // Simulate resizing delay (you can remove this setTimeout in production)
      setTimeout(() => {
        // Display the output image
        setOutputImage(paddedDataURL);
        setProcessing(false);

        // Show download button and hide resize button
        setShowDownloadButton(true);
        setShowResizeButton(false);
      }, 2000); // Simulate 2 seconds delay for resizing
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Resize Me
      </Typography>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <TextField
          type="number"
          label="Capacity (in bytes)"
          value={capacity}
          onChange={handleCapacityChange}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          style={{ flexGrow: 1 }}
        />
        <div {...getRootProps()} style={{ padding: '20px', border: '2px dashed #ccc', flexBasis: '50%' }}>
          <input {...getInputProps()} />
          <Typography variant="body1" style={{ textAlign: 'center' }}>Drag 'n' drop an image file here, or click to select one</Typography>
        </div>
      </div>
      {file && <Typography variant="body1">Selected File: {file.name}</Typography>}
      {outputImage && <img src={outputImage} alt="Output" style={{ marginTop: '20px', maxWidth: '100%' }} />}
      {showResizeButton && (
        <Button
          variant="contained"
          onClick={resizeImage}
          disabled={!file || processing}
          style={{ marginTop: '20px' }}
        >
          {processing ? <CircularProgress size={24} color="inherit" /> : 'Resize Image'}
        </Button>
      )}
      {showDownloadButton && (
        <Button
          variant="contained"
          onClick={() => saveAs(outputImage, 'resized_image.png')}
          style={{ marginTop: '20px', marginLeft: '10px' }}
        >
          Download Resized Image
        </Button>
      )}
    </div>
  );
}

export default App;

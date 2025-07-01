import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat';

const FileUpload = ({ children, onFileUpload }) => {
  const { uploadFile } = useChat();
  const fileInputRef = React.createRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadedFile = await uploadFile(file);
      onFileUpload(uploadedFile);
    } catch (err) {
      console.error('File upload failed:', err);
      alert('File upload failed. Please try again.');
    }
  };

  return (
    <>
      <div onClick={handleClick}>{children}</div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*, .pdf, .doc, .docx, .txt, audio/*, video/*"
      />
    </>
  );
};

export default FileUpload;
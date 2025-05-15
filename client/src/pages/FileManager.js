import React, { useState, useEffect } from "react";
import axios from "../services/api";

const FileManager = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        console.log('fetchFiles...')
        try {
            const response = await axios.get("/files");
            console.log('fetched!')
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await axios.post(`/files/upload?filename=${selectedFile.name}`, selectedFile, {
                headers: { "Content-Type": "application/octet-stream" },
            });
            alert("File uploaded successfully!");
            fetchFiles();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleDelete = async (filename) => {
        try {
            await axios.delete(`/files/${filename}`);
            alert("File deleted successfully!");
            fetchFiles();
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <div>
            <h1>File Manager</h1>
            <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload File</button>
            <ul>
                {files.map((file) => (
                    <li key={file}>
                        {file}{" "}
                        <button onClick={() => handleDelete(file)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileManager;
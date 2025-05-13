import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Brain,
  Activity,
  Stethoscope,
  FileText,
  Zap,
  Trash2,
  FilePlus,
  Loader2,
  ArrowRight,
  FileSpreadsheet,
  Upload,
  File,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ACCEPTED_FILE_TYPES,
  analyzeDocumentsPrompt,
  callGeminiAPI,
  extractPDFText,
  formatFileSize,
  MAX_FILE_SIZE,
  MAX_FILES,
} from "@/lib/utils";

const UploadDoc: React.FC = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [comments, setComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (fileList) => {
    const validFiles = [];
    const remainingSlots = MAX_FILES - files.length;

    // Get all accepted extensions
    const acceptedExtensions = Object.values(ACCEPTED_FILE_TYPES).flat();

    for (
      let i = 0;
      i < fileList.length && validFiles.length < remainingSlots;
      i++
    ) {
      const file = fileList[i];
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

      // Check if the file type is accepted
      const isValidType =
        Object.keys(ACCEPTED_FILE_TYPES).includes(file.type) ||
        file.type.startsWith("image/") || // Accept any image type
        acceptedExtensions.includes(extension);

      if (isValidType) {
        if (file.size <= MAX_FILE_SIZE) {
          validFiles.push(file);
        } else {
          toast.error(
            `${file.name} is too large. Maximum size is ${(
              MAX_FILE_SIZE /
              (1024 * 1024)
            ).toFixed(0)}MB.`
          );
        }
      } else {
        toast.error(`${file.name} has an unsupported file type.`);
      }
    }

    return validFiles;
  };

  const handleFileChange = (e) => {
    if (files.length >= MAX_FILES) {
      toast.error(`Maximum of ${MAX_FILES} files allowed`);
      return;
    }

    if (e.target.files) {
      const newFiles = validateFiles(e.target.files);

      if (newFiles.length > 0) {
        const updatedFiles = [...files, ...newFiles].slice(0, MAX_FILES);
        setFiles(updatedFiles);

        toast.success(
          `Added ${newFiles.length} file${newFiles.length > 1 ? "s" : ""}`
        );
      }

      // Reset the file input
      e.target.value = "";
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (files.length >= MAX_FILES) {
      toast.error(`Maximum of ${MAX_FILES} files allowed`);
      return;
    }

    const newFiles = validateFiles(e.dataTransfer.files);

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles].slice(0, MAX_FILES);
      setFiles(updatedFiles);

      toast.success(
        `Added ${newFiles.length} file${newFiles.length > 1 ? "s" : ""}`
      );
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please upload at least one file to analyze");
      return;
    }

    setIsProcessing(true);

    try {
      // Send files for analysis
      const analysisResult = (await extractPDFText(files, comments)) as any;
      console.log("analysisResult :", analysisResult[0]);

      if (analysisResult.error) {
        toast.error("No text content found in the uploaded file");
        return;
      }

      const finalPrompt = await analyzeDocumentsPrompt(analysisResult[0]);
      console.log("finalPrompt :", finalPrompt);

      const aiResult = await callGeminiAPI(finalPrompt as any);
      // Store the analysis result in localStorage
      localStorage.setItem("documentAnalysis", JSON.stringify(aiResult));

      // Show success message
      toast.success("Documents analyzed successfully!");

      // Navigate to analysis page
      navigate("/analysis");
    } catch (error) {
      console.error("Error processing documents:", error);
      toast.error("Failed to analyze documents. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const FileIcon = ({ file }) => {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "pdf") return <File className="h-5 w-5 text-red-500" />;
    if (["doc", "docx"].includes(extension || ""))
      return <FileText className="h-5 w-5 text-blue-500" />;
    if (["jpg", "jpeg", "png"].includes(extension || ""))
      return <FileText className="h-5 w-5 text-green-500" />;

    return <File className="h-5 w-5 text-gray-500" />;
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    const removedFile = updatedFiles[index];

    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    toast.info(`Removed ${removedFile.name}`);
  };

  return (
    <AppLayout>
      <form onSubmit={handleFormSubmit}>
        <Card className="w-full shadow-md border-primary/10 ">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Medical Document Analysis</CardTitle>
                <CardDescription>
                  Upload medical records and documents for AI analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-primary mb-2" />
                <h4 className="font-medium mb-1">Medical Records</h4>
                <p className="text-sm text-gray-600">
                  Patient histories, diagnoses, and treatment plans
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-green-500 mb-2" />
                <h4 className="font-medium mb-1">Test Results</h4>
                <p className="text-sm text-gray-600">
                  Lab reports, imaging results, and vital measurements
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <Brain className="h-5 w-5 text-amber-500 mb-2" />
                <h4 className="font-medium mb-1">Clinical Notes</h4>
                <p className="text-sm text-gray-600">
                  Physician notes, observations, and recommendations
                </p>
              </div>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all 
              ${dragActive ? "border-primary bg-primary/5" : "border-gray-300"} 
              ${files.length > 0 ? "bg-gray-50" : "bg-white"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(",")}
                className="hidden"
                disabled={isProcessing}
              />

              <div className="flex flex-col items-center justify-center text-center">
                {files.length === 0 ? (
                  <>
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Upload your medical documents
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Drag and drop your files, or click to browse
                    </p>
                    <Button
                      onClick={openFileBrowser}
                      disabled={isProcessing}
                      variant="outline"
                    >
                      Select Files
                    </Button>
                    <p className="text-xs text-gray-400 mt-4">
                      Accepted format: PDF (max{" "}
                      {(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB)
                    </p>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="flex flex-col gap-4">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <FileIcon file={file} />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                            disabled={isProcessing}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={openFileBrowser}
                        disabled={isProcessing || files.length >= MAX_FILES}
                      >
                        <FilePlus className="h-4 w-4 mr-2" />
                        Add More Files
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context
              </label>
              <Textarea
                placeholder="Add any specific concerns or areas to focus on during the analysis..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[100px]"
                disabled={isProcessing}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <Button type="submit" disabled={isProcessing || files.length === 0}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Documents...
                </>
              ) : (
                <>
                  Analyze Documents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <div className="text-sm text-gray-500">
              {files.length} of {MAX_FILES} files selected
            </div>
          </CardFooter>
        </Card>
      </form>
    </AppLayout>
  );
};

export default UploadDoc;

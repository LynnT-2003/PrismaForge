"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookImage,
  BookImageIcon,
  CameraIcon,
  ImagePlusIcon,
} from "lucide-react";
import { Alert, Snackbar } from "@mui/material";

const TestPage = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const cameraModalRef = useRef<HTMLDivElement | null>(null);

  const handleOpenCamera = () => setIsCameraOpen(true);
  const handleCloseCamera = () => setIsCameraOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cameraModalRef.current &&
        !cameraModalRef.current.contains(event.target as Node)
      ) {
        setIsCameraOpen(false);
      }
    };

    if (isCameraOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCameraOpen]);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // setFile(imageSrc); // Set the captured image as the file
        localStorage.setItem("uploadedFile", imageSrc);
        console.log("Captured Image: ", imageSrc);
        setIsCameraOpen(false);
        router.push("/ImageUpload/upload-success");
      }
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleFileUpload = (file: File) => {
    try {
      console.log("File uploaded:", file);

      // Check if file size exceeds 5MB
      if (file.size > 5 * 1024 * 1024) {
        // Trigger the alert for files over 5MB
        console.log("File size exceeds 5MB. Please upload a smaller file.");
        setAlertOpen(true);
        return;
      }

      const reader = new FileReader();
      // const chosenTemplate = template;

      reader.onload = () => {
        const base64String = reader.result as string;
        localStorage.setItem("uploadedFile", base64String);
        router.push("/ImageUpload/upload-success");
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("An error occurred during the file upload. Please try again.");
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null); // Clear the file state
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  const router = useRouter();
  return (
    <div className="h-[100dvh] w-screen">
      <div className="relative h-[85dvh]">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="h-full w-full object-cover"
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
          <div className="absolute flex flex-wrap w-full aspect-square p-16 items-center justify-center gap-24">
            <div className="w-1/4 h-1/4 border-t-2 border-l-2 border-white" />
            <div className="w-1/4 h-1/4 border-t-2 border-r-2 border-white" />
            <div className="w-1/4 h-1/4 border-b-2 border-l-2 border-white" />
            <div className="w-1/4 h-1/4 border-b-2 border-r-2 border-white" />
            <h1 className="absolute bottom-[0.5rem] text-white text-center bg-[#294c29] py-2 px-4 rounded-full opacity-90">
              Take a clear picture
            </h1>
            {alertOpen && (
              <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={handleAlertClose}
                className="mx-auto w-[75vw] absolute bottom-0 z-50"
              >
                <Alert
                  onClose={handleAlertClose}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  File size exceeds 5MB. Please upload a smaller file.
                </Alert>
              </Snackbar>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        id="file-upload-handle"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            // Validate file size
            if (selectedFile.size > 5 * 1024 * 1024) {
              setAlertOpen(true);
            } else {
              handleFileUpload(selectedFile); // Proceed with file processing
            }

            // Reset the file input so the same file can be selected again
            if (fileInputRef.current) {
              fileInputRef.current.value = ""; // Clear the value programmatically
            }
          }
        }}
        className="hidden"
      />

      <div className="h-[15dvh] flex items-center justify-between">
        <Button
          onClick={() => {
            router.push("/");
          }}
          variant={"ghost"}
          className="w-1/3 flex items-center justify-center bg-none h-full hover:bg-[#181818]"
        >
          <div className="flex flex-col w-[3.5rem] items-center justify-center">
            <ArrowLeft size="80%" strokeWidth={0.5} />
            <h1 className="font-medium mt-1">Cancel</h1>
          </div>
        </Button>
        <div className="w-1/3 flex items-center justify-center">
          <Button
            onClick={handleCapture}
            className="p-8 rounded-full aspect-square bg-gray-300 border-white border-[0.4rem] "
            variant={"ghost"}
          ></Button>
        </div>

        <Button
          onClick={handleClick}
          variant={"ghost"}
          className="w-1/3 rounded-full hover:bg-[#181818]"
        >
          <ImagePlusIcon
            size="3.5rem"
            className="font-light"
            strokeWidth={0.5}
          />
        </Button>
      </div>
    </div>
  );
};

export default TestPage;
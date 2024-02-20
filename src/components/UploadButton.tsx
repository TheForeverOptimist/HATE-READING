"use client"


import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

import Dropzone from "react-dropzone"

const UploadDropzone = () => {
    return <Dropzone multiple={false}>
        {({getRootProps, getInputProps, acceptedFiles}) => (
            <div {...getRootProps()} className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"></div>
        )}
    </Dropzone>
}

const UploadButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return(
       <Dialog open={isOpen} onOpenChange={(v) => {
        if(!v){
            setIsOpen(v)
        }
       }}>
        <DialogTrigger onClick={() => setIsOpen(true)} asChild>
            <Button>Upload PDF</Button>
        </DialogTrigger>

        <DialogContent>
            <UploadDropzone />
        </DialogContent>
       </Dialog>
    )
}

export default UploadButton;
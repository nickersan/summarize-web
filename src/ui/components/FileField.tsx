import "./FileField.css"
import {DragEvent, useRef, useState} from "react";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {MdOutlineRemoveCircle} from "react-icons/md";

interface FileFieldProps
{
  id: string;
  onChange: (file: File | undefined) => void;
}

export default function FileField({id, onChange}: FileFieldProps)
{
  const [file, setFile] = useState<File>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File | undefined) =>
  {
    setFile(file);
    onChange(file);
  }

  const handleFileDrop = (event: DragEvent) =>
  {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.length > 0 ? event.dataTransfer.files[0] : undefined);
  }

  const handleFileChange = (event: any) =>
  {
    event.preventDefault();
    handleFile(event.currentTarget.files?.length > 0 ? event.currentTarget.files[0] : undefined);
  };

  const handleFileRemove = (event: any) =>
  {
    event.preventDefault();
    handleFile(undefined);
    inputRef.current!.value = "";
  }

  return (
    <section>
      <div
        className="MuiFormControl-root MuiFormControl-marginDense MuiFormControl-fullWidth MuiTextField-root"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleFileDrop}
      >
        <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl">
          {
            file ? (
                <fieldset className="MuiOutlinedInput-notchedOutline DropArea">
                  <p>{file.name}</p>
                  <MdOutlineRemoveCircle className="RemoveFile" onClick={handleFileRemove}/>
                </fieldset>
            ) :
            (
              <fieldset className="MuiOutlinedInput-notchedOutline DropArea">
                <AiOutlineCloudUpload/>
                <p>Drop recording file here to upload...</p>
                <p className="Limit">Limit 10MB</p>
              </fieldset>
            )
          }
        </div>
      </div>
      <input id={id} ref={inputRef} type="file" style={{display: "none"}} onChange={handleFileChange}/>
      <label className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButton-colorPrimary css-1apkmlw-MuiButtonBase-root-MuiButton-root" htmlFor={id}>Browse</label>
    </section>
  );
}
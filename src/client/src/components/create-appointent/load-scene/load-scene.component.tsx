import React, {useEffect, useRef, useState} from "react";
import "./load-scene.styles.scss";
import {Tooltip} from "primereact/tooltip";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {Tag} from "primereact/tag";
import {FileUploadUploadParams, FileUploadSelectParams, FileUpload} from "../../../inputs/upload-file/FileUpload";
import {ProgressBar} from "primereact/progressbar";

export const LoadScene: React.FC<{fileLimit?: number}> = ({fileLimit= 1})=>{
    const [totalSize, setTotalSize] = useState(0);
    const [fileCount, setFileCount] = useState(0);
    const toast = useRef<any>(null);
    const fileUploadRef = useRef<any>(null);

    useEffect(()=>{
        console.log("TotalSizeEffect", totalSize);
    }, [totalSize]);

    const onUpload = () => {
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    const onTemplateSelect = (e: FileUploadSelectParams) => {
        let _totalSize = 0;
        let _totalFileCount = 0;

        console.log(Object.keys(e.files).map((key:any) => e.files[key].size));
        Object.keys(e.files).slice(0,fileLimit).map((key:any) => e.files[key]).forEach(file => {
            _totalSize += file.size;
            _totalFileCount ++;
        });

        console.log('onTemplateSelect', _totalSize,fileLimit);
        setFileCount(_totalFileCount);
        setTotalSize(_totalSize);
    }

    const onTemplateUpload = (e:FileUploadUploadParams) => {
        console.log("onTemplateUpload",totalSize)
        let _totalSize = 0;
        let _totalFileCount = 0;
        Object.keys(e.files).map((key:any) => e.files[key]).forEach(file => {
            _totalSize += (file.size || 0);
            _totalFileCount++;
        });

        setFileCount(_totalFileCount);
        setTotalSize(_totalSize);
        toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    const onTemplateRemove = (file: any, callback: any = null) => {
        console.log("onTemplateRemove",totalSize,file.size)
        setTotalSize(totalSize - file.size);

        if(callback)
            callback();
    }

    const onTemplateClear = () => {
        setTotalSize(0);
        setFileCount(0);
    }

    const headerTemplate = (options: any) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize/100000;

        console.log(fileUploadRef.current);
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';
        console.log("headerTemplateRerender", value, formatedValue);

        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 10 MB`} style={{width: '300px', height: '20px', marginLeft: 'auto'}}></ProgressBar>
            </div>
        );
    }

    const itemTemplate = (file: any, props: any) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{width: '40%'}}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Перетащите сюда изображение(схему) места, где будет проводиться мероприятие</span>
            </div>
        )
    }

    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: true, className: `custom-choose-btn p-button-rounded p-button-outlined ${fileCount >= fileLimit ? 'hidden': ''}`};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};

    function beforeUp() {
        console.log(fileUploadRef.current);
        fileUploadRef.current.clear();
    }

    return (
        <div>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <div className="card">
                <FileUpload ref={fileUploadRef} name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="image/*"
                            fileLimit = {fileLimit}
                            maxFileSize={10000000}
                            onBeforeUpload={beforeUp}
                            onValidationFail={onTemplateRemove}
                            onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                            headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                            chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />

            </div>
        </div>
    )
}
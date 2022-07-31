import type {NextPage} from 'next'
import axios, {AxiosResponse} from "axios";
import {useMutation} from '@tanstack/react-query';
import {useState} from "react";

const POST_PATH = '/api/upload';

export interface UseMutationUploadFileVariables {
    progressCallBack?: (progressEvent: ProgressEvent) => void
    file: File
}

const mutationFnUploadFile = async ({progressCallBack, file}: UseMutationUploadFileVariables) => {
    let fd = new FormData();

    fd.append("theFiles", file);


    return axios.post<any, AxiosResponse, FormData>(POST_PATH, fd,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "*/*"
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
                progressCallBack?.(progressEvent)
            }
        })
}
const Home: NextPage = () => {
    const {mutate} = useMutation(mutationFnUploadFile, {
        onError: (error) => {
            console.error(error);
        }
    });
    const [progress, setProgress] = useState("0");

    return (
        <div>
            <h1>Upload a file here.</h1>
            <input type="file" onChange={async (e) => {
                const file = e.target?.files?.[0];
                if (file) {
                    mutate({
                        file, progressCallBack: (progressEvent) => {
                            setProgress(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2))
                        }
                    })
                }
            }}/>
            {progress}%
        </div>
    );
}

export default Home

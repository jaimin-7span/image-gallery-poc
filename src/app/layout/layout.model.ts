export interface uploadRequestData{
    title:string;
    uploadFile:any;
    tags:Array<string>
}

export interface listImage{
    title:string;
    uploadFile:any;
    tags:Array<string>
    createdAt:string
}

export interface tagList{
    tagName:string;
    isActive:boolean
}

export interface viewImageData{
    type:string,
    data:listImage
}
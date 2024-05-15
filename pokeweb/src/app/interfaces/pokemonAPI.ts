export interface Data{
    count:number;
    next:string;
    previous: string;
    results: resultArray[];
}

export interface resultArray{
    name: string,
    url: string,
}
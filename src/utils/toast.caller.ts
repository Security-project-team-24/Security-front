export interface toastInfo{

}

export const displayToast = (toast:any, title:string, status:string) =>{
        toast({
        title: title,
        status: status,
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
}
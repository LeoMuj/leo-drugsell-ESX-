export const Delay = async (ms:any) => {
    return new Promise((res) => {
        setTimeout(res, ms)
    })
}
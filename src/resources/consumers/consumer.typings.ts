export default interface Consumer {
    startPolling(): Promise<void>   
}
import StickerPriceService from "./Services/StickerPriceService/StickerPriceService";

class DataSource {

    stickerPriceService: StickerPriceService;

    constructor() {
        console.log('Initializing data source...');
        this.stickerPriceService = new StickerPriceService();
    }
}

export default DataSource;
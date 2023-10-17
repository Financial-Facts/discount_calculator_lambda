import { Discount } from "@/services/discount/discount.typings";
import { Consumer } from "sqs-consumer";

export async function watchForEmptyQueue(app: Consumer): Promise<void> {
    let lastBatchRecievedTime = new Date();
    app.on('message_received', () => {
        lastBatchRecievedTime = new Date();
    });
    while (app.isRunning) {
        const previousLastMessageTime = lastBatchRecievedTime;
        await sleep(20 * 1000);
        if (previousLastMessageTime.valueOf() === lastBatchRecievedTime.valueOf()) {
            console.log('Have not received message in 20 seconds, discontinuing polling...');
            app.stop();
        }
    }
}

export function removeS3KeySuffix(key: string): string {
    return key.slice(0, -5);
}

export async function sleep(millis: number): Promise<void> {
    return new Promise(f => setTimeout(f, millis));
}

export function checkDiscountIsOnSale(currentPrice: number, discount: Discount): boolean {
    return checkDiscountDataMeetsRequirements(currentPrice,
        discount.stickerPrice.ttyPriceData.salePrice,
        discount.benchmarkRatioPrice.ratioPrice);
}

function checkDiscountDataMeetsRequirements(
    currentPrice: number,
    tty: number,
    ratioPrice?: number
): boolean {
    return currentPrice < tty &&
        (ratioPrice ? currentPrice < ratioPrice : true);
}
export type Period = 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FY';

export interface Valuation<T> {
    cik: string,
    price: number,
    input: T
}

export interface PeriodicData {
    cik: string
    announcedDate: Date
    period?: Period
    value: number
}

export interface Consumer {
    startPolling(): Promise<void>   
}

export interface SqsMsgBody {
    Records: S3Event[];
}

export interface S3Event {
    eventVersion: string,
    eventSource: string,
    awsRegion: string,
    eventTime: Date,
    eventName: string,
    userIdentity: {
        principalId: string
    },
    requestParameters: {
        sourceIPAddress: string,
    },
    responseElements: Record<string, string>,
    s3: {
        s3SchemaVersion: string,
        configurationId: string,
        bucket: {
            name: string,
            ownerIdentity: {
                principalId: string
            },
            arn: string
        },
        object: {
            key: string,
            size: number,
            eTag: string,
            sequencer: string
        }
    }
}

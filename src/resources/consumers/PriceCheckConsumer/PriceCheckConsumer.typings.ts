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
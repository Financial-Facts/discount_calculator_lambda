import S3Event from "./S3Event";

export default interface SqsMsgBody {
    Records: S3Event[];
}
abstract class AbstractOutput {

    abstract submit(input: any): Promise<any>;

}

export default AbstractOutput;
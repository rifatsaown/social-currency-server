import { ZodError, ZodIssue } from "zod";
import { IErrorSources, IGenericErrorResponse } from "../interfaces/error";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
    const errorSources: IErrorSources = error.issues.map((issue: ZodIssue) => {
        return {
            path: issue?.path[issue.path.length - 1] as string,
            message: issue?.message
        }
    })

    const statusCode = 400;

    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};

export default handleZodError;

import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
    const params = {
        TableName: 'notes',
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call('get', params);
        if (result.Item) {
            return success(result.Item);
        } else {
            return failure({ status: false, error: 'Item not found' });
        }
    } catch (error) {
        console.log(error);
        return failure({ status: false });
    }
}
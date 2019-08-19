import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
    const params = {
        TableName: 'notes',
        /*
            Key: define la clave de particion y la clave de
                clasificacion del elemento que se eliminara
            userId: ID de identidad del grupo de identidades
                del usuario autenticado
            noteId: parametro de ruta
        */
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: event.pathParameters.id
        }
    };

    try {
        await dynamoDbLib.call('delete', params);
        return success({ status: true });
    } catch (error) {
        console.log(error);
        return failure({ status: false });
    }
}

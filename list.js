import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
    const params = {
        TableName: 'notes',
        /*
            KeyConditionExpression: define la condicion para la consulta
            userId = :userId: solo devuelve elementos con la clave de
                particion correspondiente a userId
            ExpressionAttributeValues: define el valor en la condicion
            :userId: define userId como ID de identidad de Idetity Pool
                del usuario autenticado
        */
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId
        }
    };

    try {
        const result = await dynamoDbLib.call('query', params);
        // devuelve la lista de elementos coincidentes en el body de
        // la respuesta
        return success(result.Items);
    } catch (error) {
        console.log(error);
        return failure({ status: false });
    }
}

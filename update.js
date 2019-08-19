import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: 'notes',
        /*
            Key: define la clave de particion y la clave de clasificacion
                del elemento que se actualizara
            userId: ID de identidad del grupo de identidades del usuario
                autenticado
            noteId: parametro de ruta

        */
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: event.pathParameters.id
        },
        /*
            UpdateExpression: define los atributos que se actualizaran
            ExpressionAttributeValues: define el valor en la expresion
                de actualizacion
        */
        UpdateExpression: 'SET content = :content, attachment = :attachment',
        ExpressionAttributeValues: {
            ':attachment': data.attachment || null,
            ':content': data.content || null
        },
        /*
            ReturnValues: especifica si y como devolver los atributos del
                elemento, donde ALL_NEW devuelve todos los atributos del
                elemento despues de la actualizacion

        */
        ReturnValues: 'ALL_NEW'
    };

    try {
        await dynamoDbLib.call('update', params);
        return success({ status: true });
    } catch (error) {
        console.log(error);
        return failure({ status: false });
    }
}

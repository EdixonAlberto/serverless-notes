import uuid from "uuid";
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context) {
    // El request body se pasa como una cadena codificada en JSON en 'event.body'
    const data = JSON.parse(event.body);
    /*
        - Item: contiene los atributos del elemento a crear
        - userId: las identificaciones de usuario de 'cognito identity pool',
          usando el ID de identidad como el user id del usuario autenticado
        - noteId: un uuid unico
        - content: contenido del request body
        - attachment: adjunto del request body
        - createAt: marca de tiempo actual en formato UNIX
    */
    const params = {
        TableName: "notes",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createAt: Date.now()
        }
    };

    try {
        await dynamoDbLib.call('put', params);
        return success(params.Item);
    } catch (error) {
        console.log(error);
        return failure({ status: false });
    }
}

// NOT REFACTORY
//     dynamoDb.put(params, (error, data) => {
//         // Establecer headers de respuesta para habilitar CORS (cross-origin resource sharing)
//         const headers = {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Credentials": true
//         };

//         // Retornar codigo de estado 500 por error
//         if (error) {
//             const response = {
//                 statusCode: 500,
//                 headers: headers,
//                 body: JSON.stringify({ status: false })
//             };
//             callback(null, response);
//             return;
//         }

//         // Retornar codigo de estado 200 y el item recientemente creado
//         const response = {
//             statusCode: 200,
//             headers: headers,
//             body: JSON.stringify(params.Item)
//         };
//         callback(null, response);
//     });

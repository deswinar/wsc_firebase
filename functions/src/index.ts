import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as firebaseHelper from 'firebase-functions-helper/dist';
import * as express from 'express';
import * as bodyParser from 'body-parser';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: false}));

const devicesCollection = 'devices';
export const webApi = functions.https.onRequest(main);

// View all devices
app.get('/devices', (req, res) => {
    firebaseHelper.firestore
        .backup(db, devicesCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send('Cannot get devices: ${error}'));
})

// View a device
app.get('/devices/:deviceId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, devicesCollection, req.params.deviceId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send('Cannot get device: $(error)'));
})

app.patch('/devices/:deviceId', async(req, res) => {
    try{
        await firebaseHelper.firestore.updateDocument(db, devicesCollection, req.params.deviceId, req.body);
        res.status(200).send('Update Success');
    }catch(error){
        res.status(204).send('Patch Error');
    }
});
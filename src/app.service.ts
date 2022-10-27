import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../firebase/privateKey.json';

@Injectable()
export class AppService {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as ServiceAccount)
        });
    }
}

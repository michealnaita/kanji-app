import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const welcomeEmail = functions.auth.user();

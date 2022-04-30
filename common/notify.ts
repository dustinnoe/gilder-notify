
import { db } from '../common/database/db_init'
import axios from 'axios';

function getNotifySubscriptions(type: string, realmPk: string): any{
    console.log(type, realmPk)
   let tokens = db.prepare(
       "SELECT mobile_token FROM notification_subscription WHERE subscription_type = ? AND pubkey_subscribe = ?"
    )
   .all(
       type, 
       realmPk
    );
    return tokens;
}

export async function notifyNewProposals(realmPk: string, realmName: string, proposalName: string, proposalPk: string){
    let subs = getNotifySubscriptions("newProposals", realmPk);
    console.log(subs)
    subs.forEach((s: any) => {
        axios.post( "https://api.expo.dev/v2/push/send", {
            to: s.mobile_token,
            title: "New proposal on " + realmName,
            body: proposalName,
            data: {
                realmId: realmPk,
                proposalId: proposalPk
            }
        })
        .then(function (response) {
            console.log('SENDING NOTIFICATION: New proposal on ' + realmName + ': '+ proposalName)
        })
            .catch(function (error) {
            console.log(error);
        });
    });
}
import * as web3 from "@solana/web3.js";
import { RPC_CONNECTION } from "../common/constants/Solana";
import { db } from '../common/database/db_init';
import {getNewerProposals} from '../gilder-realm-check/proposalChecker';
import {notifyNewProposals} from '../common/notify';

let connection = new web3.Connection(RPC_CONNECTION, "confirmed");

async function test(){
    let realms: any = db.prepare('SELECT pubkey, owner, name FROM realms').all();
    
    for(let i=0; i<realms.length;i++){
        console.log("Listening to realm: " + realms[i].name + " " + realms[i].pubkey);
        connection.onAccountChange(
            new web3.PublicKey(realms[i].pubkey), 
            async (accountInfo , context) => {
                let realmPk = function(r){return r}(realms[i].pubkey)
                let ownerPk = function(r){return r}(realms[i].owner)
                let name = function(r){return r}(realms[i].name)
                let newer = await getNewerProposals(connection, new web3.PublicKey(realmPk), new web3.PublicKey(ownerPk), true)
                newer.forEach((n: any) => {
                    notifyNewProposals(realmPk, name, n.account.name, n.pubkey.toBase58());
                })
            }
        );
    }
}
test();

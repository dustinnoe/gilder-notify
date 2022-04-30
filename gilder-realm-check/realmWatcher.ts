import * as web3 from "@solana/web3.js";
import { getRealm,getAllProposals } from "@solana/spl-governance";
import { RPC_CONNECTION } from "../common/constants/Solana";
import { db } from '../common/database/db_init'
import BN from 'bn.js';
import axios from 'axios';

// Get most recent proposal
let connection = new web3.Connection(RPC_CONNECTION, "confirmed");

async function initRealmTracking(realmPk: web3.PublicKey){
    let realm = await getRealm(connection, realmPk);
    db.prepare(
        'INSERT INTO realms (pubkey, owner, name) VALUES (?, ?, ?)'
    ).run(
        realm.pubkey.toBase58(),
        realm.owner.toBase58(),
        realm.account.name
    )
}

async function updateRealm(realmPk: web3.PublicKey){
    let realm = await getRealm(connection, realmPk);
}

async function updateRealms(){
    // Get a list of realms to update.
    let realms: any = [];
    realms.forEach((realm: any) => {
        updateRealm(realm.realm_pubkey);
    });
}

function updateLastProposalForRealm(realmPk: web3.PublicKey, proposalDetails: any){
    let zero: BN = new BN(0);
    if(proposalDetails == undefined)
        proposalDetails = {
            name: '',
            descriptionLink: '',
            draftAt: zero
        }
    db.prepare('DELETE FROM proposals WHERE realm_pubkey = ?').run(realmPk.toBase58());
    db.prepare(
        'INSERT INTO proposals (realm_pubkey, name, descriptionLink, draftAt) VALUES (?, ?, ?, ?)'
    ).run(
        realmPk.toBase58(),
        proposalDetails.name,
        proposalDetails.descriptionLink,
        proposalDetails.draftAt.toNumber()
    );

}

function checkNewProposals(realmPk: web3.PublicKey): boolean {

    return true;
}

function getLastStoredProposalDraftAtTime(realmPk: string){
  const row = db.prepare("SELECT * FROM proposals WHERE realm_pubkey = ? ORDER BY draftAt ASC LIMIT 1").get(realmPk)
  if(!row) return 0;
  return row.draftAt;
}

async function getNewerProposals(realmPk: web3.PublicKey, governancePk: web3.PublicKey){
    let lastProposalTime: number, governances;
    try {
        lastProposalTime = getLastStoredProposalDraftAtTime(realmPk.toBase58());
        governances = await getAllProposals(connection, governancePk, realmPk);
    } catch(err: any) {
        return [];
    }
    
    let last: any = {};
    let newer: any = [];
    governances.forEach(g => {
        g.forEach(proposal => {
            if(Object.keys(last).length == 0 || proposal.account.draftAt.toNumber() > last.account.draftAt.toNumber())
                last = proposal;
            if(proposal.account.draftAt.toNumber() > lastProposalTime) newer.push(proposal);
        });
    });
    updateLastProposalForRealm(realmPk, last.account);
    return newer;
}

function sendNotifications(realmName: string, proposals: any){
    proposals.forEach( (p: any) =>{
        axios.post( "https://api.expo.dev/v2/push/send", {
            to: "ExponentPushToken[LNjcEcG495jRFL8UJ02NG8]",
            title: "New proposal on " + realmName,
            body: p.account.name,
        })
        .then(function (response) {
            console.log('SENDING NOTIFICATION: New proposal on ' + realmName + ': '+ p.account.name)
        })
            .catch(function (error) {
            console.log(error);
        });
        axios.post( "https://api.expo.dev/v2/push/send", {
            to: "ExponentPushToken[GgGIptKsB6O32SjqM48qlI]",
            title: "New proposal on " + realmName,
            body: p.account.name,
        })
        .then(function (response) {
            console.log('SENDING NOTIFICATION: New proposal on ' + realmName + ': '+ p.account.name)
        })
            .catch(function (error) {
            console.log(error);
        });
    })
}

async function test(){
    let realms: any = db.prepare('SELECT pubkey, owner, name FROM realms').all();
    for(let i=0; i<realms.length;i++){
        console.log("Checking realm: " + realms[i].name)
        const newer = await getNewerProposals(new web3.PublicKey(realms[i].pubkey), new web3.PublicKey(realms[i].owner));
        if(newer.length > 0){
            sendNotifications(realms[i].name, newer);
        }
    }
    setTimeout(test, 300000)
}

//initRealmTracking(new web3.PublicKey("41SoCf3dmToE3YNJxAzz3GqNMp9SnzzYBH7cB7f1RJ82"));

//let counter = 0, realms: any = [];
test();
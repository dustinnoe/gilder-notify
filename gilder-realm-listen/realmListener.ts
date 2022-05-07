import 'reflect-metadata';
import axios from "axios";
import BN from 'bn.js';

import * as web3 from "@solana/web3.js";
import { RPC_CONNECTION } from "../common/constants/Solana";
import { getAllProposals, getRealm } from "@solana/spl-governance";

import { DataSource, IsNull } from "typeorm";
import { NotificationSubscription } from '../api/src/notificationSubscription.entity';
import { Realm } from '../api/src/realms.entity';
import { NotifyProposal } from '../api/src/proposals.entity';

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./test.db",
    entities: [Realm, NotifyProposal, NotificationSubscription],
});

const realmsRepository = AppDataSource.getRepository(Realm);
const nsRepository = AppDataSource.getRepository(NotificationSubscription);
const npRepository = AppDataSource.getRepository(NotifyProposal);

let connection = new web3.Connection(RPC_CONNECTION, "confirmed");

async function getNotifySubscriptions(type: string, realmPk: string){
    console.log(type, realmPk)
    let tokens = await nsRepository.find({
        where: { type: type, realm: realmPk}
    });
    return tokens;
}

async function notifyNewProposals(realmPk: string, realmName: string, proposalName: string, proposalPk: string){
    let subs = await getNotifySubscriptions("newProposals", realmPk);
    subs.forEach((s: any) => {
        axios.post( "https://api.expo.dev/v2/push/send", {
            to: s.mobileToken,
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

async function updateLastProposalForRealm(realmPk: web3.PublicKey, proposalDetails: any){
    let zero: BN = new BN(0);
    if(proposalDetails == undefined)
        proposalDetails = {
            name: '',
            descriptionLink: '',
            draftAt: zero
        }
    
    let last = await npRepository.findOne({
        where: { realmPubkey: realmPk.toBase58() },
        order: { draftAt: 'DESC' }
    });
    if(last) await npRepository.remove(last);

    let newProposal = npRepository.create({
        realmPubkey: realmPk.toBase58(),
        name: proposalDetails.name,
        descriptionLink: proposalDetails.descriptionLink,
        label: proposalDetails.options.label,
        draftAt: proposalDetails.draftAt.toNumber()
    });
    await npRepository.save(newProposal);
}

async function getLastStoredProposalDraftAtTime(realmPk: string){
    let row = await npRepository.findOne({
        where: { realmPubkey: realmPk},
        order: { draftAt: 'DESC'}
    });
    if(!row) return 0;
    return row.draftAt;
}

async function getNewerProposals(connection: web3.Connection, realmPk: web3.PublicKey, governancePk: web3.PublicKey, update?: boolean){
    let lastProposalTime: number, governances;
    try {
        lastProposalTime = await getLastStoredProposalDraftAtTime(realmPk.toBase58());
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
    if(update)updateLastProposalForRealm(realmPk, last.account);
    return newer;
}

function startRealmListener(realm: Realm){
    console.log("Listening to realm: " + realm.name + " " + realm.pubkey);
    connection.onAccountChange(
            new web3.PublicKey(realm.pubkey), 
            async (accountInfo , context) => {
                let newer = await getNewerProposals(connection, new web3.PublicKey(realm.pubkey), new web3.PublicKey(realm.owner), true)
                newer.forEach((n: any) => {
                    notifyNewProposals(realm.pubkey, realm.name, n.account.name, n.pubkey.toBase58());
                })
            }
        );
}

async function run(){
    let realms: any = await realmsRepository.find();
    realms.forEach((r: Realm) => { startRealmListener(r) });
}

AppDataSource.initialize()
.then(() => {
    run();
})
.catch((error) => console.log(error));

// Checks the database for any new realms that were subscribed to but
// are not yet being listened to for notifications.If one is found
// update the database and start a listener
async function initNewRealms(){
    let realms: any = await realmsRepository.find({
        where: { owner: IsNull(), name: IsNull() }
    });
    realms.forEach(async (r: any) => {
        console.log("Found new realm: " + r.pubkey);
        let realm: any;
        try{
            realm = await getRealm(connection, new web3.PublicKey(r.pubkey));
        } catch(err) {
            console.log(err);
            return;
        }
        try{
            await getNewerProposals(connection, new web3.PublicKey(realm.pubkey), new web3.PublicKey(realm.owner), true)
        } catch(err){
            console.log(err);
        }
        r.owner = realm.owner.toBase58();
        r.name = realm.account.name;
        await realmsRepository.save(r);
        startRealmListener(r);
    })
}

// Check for new realms every 60 seconds
setInterval(()=>{
    initNewRealms();
}, 60000)
import * as web3 from "@solana/web3.js";
import { getAllProposals } from "@solana/spl-governance";
import { db } from '../common/database/db_init'
import BN from 'bn.js';

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

function getLastStoredProposalDraftAtTime(realmPk: string){
  const row = db.prepare("SELECT * FROM proposals WHERE realm_pubkey = ? ORDER BY draftAt ASC LIMIT 1").get(realmPk)
  if(!row) return 0;
  return row.draftAt;
}

export async function getNewerProposals(connection: web3.Connection, realmPk: web3.PublicKey, governancePk: web3.PublicKey, update?: boolean){
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
    if(update)updateLastProposalForRealm(realmPk, last.account);
    return newer;
}

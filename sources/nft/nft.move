// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module nft_module::nft {

    use std::string;
    use sui::event;
    use ticket_module::ticket::{Ticket};

    // ===== Define =====
    public struct NFT has key, store {
        id: UID,
        // Token id of the token
        tokenId: u64,
        // owner for the token
        owner: string::String,
    }

    public struct Collection has key, store {
        id: UID,
        next_id: u64, // identify next tokenId
        max_supply: u64, // used token IDs from 0–24
    }

    // ===== Events =====
    public struct NFTEvent has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        owner: address,
        // The tokenId
        tokenId: u64,
    }

    // public struct CollectionEvent has copy, drop {
    //     // The Object ID of the NFT
    //     object_id: ID,
    //     // The creator of the NFT
    //     owner: address,
    //     // The id of the NFT
    //     next_id: u64,
    // }

    // ===== Entrypoints =====
    #[allow(lint(self_transfer))]
    public fun init_collection(
        _ctx: &mut TxContext,
    ) {
        // let sender = _ctx.sender();    
        let collection = Collection {
            id: object::new(_ctx),
            next_id: 0,
            max_supply: 25, // 25 NFTs
        };

        // event::emit(CollectionEvent {
        //     object_id: object::id(&collection),
        //     next_id: collection.next_id,
        //     owner: sender,
        // });

        transfer::public_share_object(collection)
    }

    #[allow(lint(self_transfer))]
    public fun mint(
        collection: &mut Collection,
        mut _ticket: Ticket,
        _ctx: &mut TxContext,
    ) {
        assert!(collection.next_id < collection.max_supply);
        
        // begin handle tickets
        _ticket.burn(_ctx);
     
        // begin increase TokenId
        let new_id = collection.next_id;
        collection.next_id = new_id + 1;
    
        // begin create NFT
        let sender = _ctx.sender();
        let nft = NFT {
            id: object::new(_ctx),
            tokenId: new_id,
            owner: sender.to_string(),
        };
        
        event::emit(NFTEvent {
            object_id: object::id(&nft),
            owner: sender,
            tokenId: new_id,
        });

        // transfer::public_transfer(nft, sender)
        transfer::public_transfer(nft, sender);

    }

    #[allow(lint(self_transfer))]
    public fun mint_by_random(
        collection: &mut Collection,
        _ctx: &mut TxContext,
    ) {
        assert!(collection.next_id < collection.max_supply);

        // begin create NFT
        let next_id = collection.next_id + 1;
        let sender = _ctx.sender();
        let nft = NFT {
            id: object::new(_ctx),
            tokenId: next_id,
            owner: sender.to_string(),
        };
        
        event::emit(NFTEvent {
            object_id: object::id(&nft),
            owner: sender,
            tokenId: next_id
        });

        transfer::public_transfer(nft, sender);
    }
}

// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module nft_module::nft {
    use sui::event;
    use ticket_module::ticket;
    use sui::random;
    use sui::table;
    use shared_module::shared;

    // ===== Define =====
    public struct NFT has key, store {
        id: UID,
        // Token id of the token
        tokenId: u64,
        // owner for the token
        owner: address,
    }

    public struct Collection has key, store {
        id: UID,
        minted: table::Table<u64, bool>,
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

    public struct CollectionEvent has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        owner: address,
    }

    // ===== Entrypoints =====
    #[allow(lint(self_transfer))]
    fun init(
        _ctx: &mut TxContext,
    ) {
        let table = table::new<u64, bool>(_ctx);

        let sender = _ctx.sender();
        let collection = Collection {
            id: object::new(_ctx),
            minted: table,
        };

        event::emit(CollectionEvent {
            object_id: object::id(&collection),
            owner: sender,
        });

        transfer::public_share_object(collection);
    }

    #[allow(lint(public_random))]
    fun random_token_id (
        generator: &mut random::RandomGenerator,
        collection: &mut Collection,
    ): u64 {
        assert!(collection.minted.length() < shared::MAX_TOKEN());

        let mut i = shared::MAX_TOKEN();
        let mut token_id: u64 = 0;

        while (i > 0) {
            let random_u64 = generator.generate_u64_in_range(0, shared::MAX_TOKEN());
            let random_existed = collection.minted.contains(random_u64);
            
            if(!random_existed){
                token_id = random_u64;
                collection.minted.add(token_id, true);

                break
            };

            i = i - 1;
        };

        return token_id
    }

    #[allow(lint(self_transfer), lint(public_random))]
    public fun mint_with_swap(
        collection: &mut Collection,
        ticket: &mut ticket::Ticket,
        r: &random::Random,
        mut amount: u64,
        ctx: &mut TxContext,
    ){
        assert!(amount > 0);

        while(amount > 0) {
            // handler ticket
            {
                ticket.burn_amount(shared::PRICE_SWAP_TICKET_TO_GET_NFT());
            };

            // handler NFT
            {
                let mut generator = r.new_generator(ctx);

                let token_id = random_token_id(&mut generator, collection);
                
                let sender = ctx.sender();
                let nft = NFT { 
                    id: object::new(ctx),
                    tokenId: token_id,
                    owner: sender,
                };

                event::emit(NFTEvent {
                    object_id: object::id(&nft),
                    owner: sender,
                    tokenId: token_id,
                });

                transfer::public_transfer(nft, sender);
            };

            amount = amount - 1;
        };
    }

    #[allow(lint(self_transfer), lint(public_random))]
    public fun mint_with_random(
        collection: &mut Collection,
        participants: &mut vector<address>,
        r: &random::Random,
        ctx: &mut TxContext
    ): address {
        let winner: address;
        let token_id: u64;

        // handler randomness
        {
            let mut generator = r.new_generator(ctx);

            winner = *participants.borrow(
                generator.generate_u64_in_range(0, participants.length() - 1)
            );
            
            token_id = random_token_id(&mut generator, collection);

        };

        // handler NFT
        {     
            let nft = NFT { 
                id: object::new(ctx),
                tokenId: token_id,
                owner: winner
            };

            event::emit(NFTEvent {
                object_id: object::id(&nft),
                owner: winner,
                tokenId: token_id,
            });

            transfer::public_transfer(nft, winner);
        };

        // handler particpants
        {
            let mut size = participants.length();

            while(size > 0){
                participants.pop_back();
                size = size - 1;
            };
        };

        return winner
    }

    #[test]
    public fun test_mock_collection(): Collection {
        let mut ctx = tx_context::dummy();
        let table = table::new<u64, bool>(&mut ctx);

        let collection = Collection {
            id: object::new(&mut ctx),
            minted: table
        };
        
        return collection
    }

    #[test] 
    public fun test_random_token_id () {
        // don't allow token_id great than max_token
        {
            let ctx = tx_context::dummy();
            let mut collection = test_mock_collection();
            let mut generator = random::new_generator_for_testing();

            let token_id = random_token_id(&mut generator, &mut collection);

            assert!(token_id <= shared::MAX_TOKEN());

            transfer::public_transfer(collection, ctx.sender());
        };

        // token_id not duplicate
        {
            let ctx = tx_context::dummy();
            let mut i = shared::MAX_TOKEN();
            let mut collection = test_mock_collection();

            while (i > 0) {
                let mut generator = random::new_generator_for_testing();

                random_token_id(&mut generator, &mut collection);

                i = i -1;
            };

            transfer::public_transfer(collection, ctx.sender());
        };
    }
}

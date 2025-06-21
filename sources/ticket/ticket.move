// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module ticket_module::ticket {
    use std::string;
    use sui::event;
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};

    const PRICE_MINT: u64 = 45000000; // 1 SUI = 10^9 MIST
    const TREASURY: address = @0x05153977c37355b20059e6d2163d6e829786ecffd679e573e8d74757913d50a0;

    // ===== Define =====
    public struct Ticket has key, store {
        id: UID,
        owner: string::String,
    }

    // ===== Events =====
    public struct TicketEvent has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        owner: address,
    }

    // ===== Entrypoints =====
    #[allow(lint(self_transfer))]
    public fun mint(
        _payment: Coin<SUI>, 
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&_payment) >= PRICE_MINT);

        /* 
            you needs to remove _payment outside memory, but the logical below doesn't have,
            the way to do that, needs transfer to TREASURY or burn it
        */
        transfer::public_transfer(_payment, TREASURY);

        let sender = ctx.sender();
        let nft = Ticket {
            id: object::new(ctx),
            owner: sender.to_string()
        };

        event::emit(TicketEvent {
            object_id: object::id(&nft),
            owner: sender,
        });

        transfer::public_transfer(nft, sender);
    }

    public fun burn(arg: Ticket, _: &mut TxContext) {
        let Ticket { id, owner: _} = arg;
        id.delete()
    }

    public fun treasury(): (u64, address) {
        (PRICE_MINT, TREASURY)
    }

    #[test_only]
    public fun test_mock_ticket(): Ticket {
        let mut ctx = tx_context::dummy();

        let ticket = Ticket {
            id: object::new(&mut ctx),
            owner: ctx.sender().to_string()
        };

        ticket
    }

    #[test]
    fun test_mint() {
        let mut ctx = tx_context::dummy();

        let coin: Coin<SUI> = coin::mint_for_testing(PRICE_MINT, &mut ctx);

        mint(coin, &mut ctx);
    }

}

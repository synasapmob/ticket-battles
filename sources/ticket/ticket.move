// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module ticket_module::ticket {
    use sui::event;
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use shared_module::shared;

    // ===== Define =====
    public struct Ticket has key, store {
        id: UID,
        owner: address,
        amount: u64,
    }

    // ===== Events =====
    public struct TicketEvent has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        owner: address,
        // the amount of creator minted
        amount: u64,
    }

    // ===== Entrypoints =====
    #[allow(lint(self_transfer))]
    public fun mint(
        _payment: Coin<SUI>, 
        ctx: &mut TxContext,
    ) {
        assert!(coin::value(&_payment) >= shared::PRICE_MINT_TICKET());

        let amount = (_payment.value() / shared::PRICE_MINT_TICKET());
        let sender = ctx.sender();

        let nft = Ticket {
            id: object::new(ctx),
            owner: sender,
            amount,
        };

        event::emit(TicketEvent {
            object_id: object::id(&nft),
            owner: sender,
            amount
        });

        transfer::public_transfer(nft, sender);
        transfer::public_transfer(_payment, shared::TREASURY_ADMIN());
    }

    #[allow(lint(self_transfer))]
    public fun mint_with_amount(
        ticket: &mut Ticket,
        _payment: Coin<SUI>,
        ctx: &mut TxContext,
    ) {        
        assert!(coin::value(&_payment) >= shared::PRICE_MINT_TICKET());

        let amount = (_payment.value() / shared::PRICE_MINT_TICKET());
        ticket.amount = ticket.amount + amount;

        event::emit(TicketEvent {
            object_id: object::id(ticket),
            owner: ctx.sender(),
            amount
        });

        transfer::public_transfer(_payment, shared::TREASURY_ADMIN());
    }

    public fun burn(arg: Ticket, _: &mut TxContext) {
        let Ticket { id, owner: _, amount: _} = arg;
        id.delete()
    }

    public fun burn_amount(arg: &mut Ticket, amount: u64) {
        assert!(arg.amount >= amount);

        arg.amount = arg.amount - amount;
    }

    #[test]
    public fun test_mock_ticket(): Ticket {
        let mut ctx = tx_context::dummy();

        let ticket = Ticket {
            id: object::new(&mut ctx),
            owner: ctx.sender(),
            amount: 1,
        };

        return ticket
    }

    #[test]
    public fun test_mint() {
        //  mint with multiple
        {
            let mut ctx = tx_context::dummy();
            let coin: Coin<SUI> = coin::mint_for_testing(shared::PRICE_MINT_TICKET() * 3, &mut ctx);

            mint(coin, &mut ctx);
        };

        // mint with single
        {
            let mut ctx = tx_context::dummy();
            let coin: Coin<SUI> = coin::mint_for_testing(shared::PRICE_MINT_TICKET(), &mut ctx);

            mint(coin, &mut ctx);
        }
    }

    #[test]
    fun test_mint_with_amount(){

        // mint with multiple
        {
            let mut ctx = tx_context::dummy();
            let mut ticket = test_mock_ticket();
            let coin: Coin<SUI> = coin::mint_for_testing(shared::PRICE_MINT_TICKET() * 3, &mut ctx);

            mint_with_amount(&mut ticket, coin, &mut ctx);

            transfer::public_transfer(ticket, ctx.sender());
        };

        // mint with single
        {
            let mut ctx = tx_context::dummy();
            let mut ticket = test_mock_ticket();
            let coin: Coin<SUI> = coin::mint_for_testing(shared::PRICE_MINT_TICKET(), &mut ctx);

            mint_with_amount(&mut ticket, coin, &mut ctx);

            transfer::public_transfer(ticket, ctx.sender());
        };

    }
}

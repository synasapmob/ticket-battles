// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

module pool_module::pool {
  use sui::event;
  use nft_module::nft;
  use ticket_module::ticket;
  use sui::random;
  use shared_module::shared;

  // ===== Define =====
  public struct Pool has key, store {
    id: UID,
    participants: vector<address>,
    winner: Option<address>,
  }

  // ===== Events =====
  public struct PoolEvent has copy, drop {
    participants: vector<address>,
    winner: Option<address>
  }

  // ===== Entrypoints =====
  fun init(ctx: &mut TxContext) {
    let participants = vector::empty<address>();
    let winner = option::none();

    let pool = Pool {
      id: object::new(ctx),
      participants,
      winner
    };

    transfer::public_share_object(pool);
  }
    
  #[allow(lint(self_transfer), lint(public_random))]
  public fun join(
    pool: &mut Pool,
    collection: &mut nft::Collection,
    ticket: &mut ticket::Ticket,
    r: &random::Random,
    ctx: &mut TxContext
  ): Option<address> {
    let sender = ctx.sender();
    let mut winner = option::none();

    // handler ticket
    {
      ticket.burn_amount(1)
    };

    // handler pool
    {
      // allow participant join this pool
      pool.participants.push_back(sender);

      // who lucky?, winner will be get one NFT with random
      if(pool.participants.length() >= shared::ENOUGH_PARTICIPANTS_POOL()){
        winner.fill(nft::mint_with_random(collection, &mut pool.participants, r, ctx));
      }
    };

    event::emit(PoolEvent { 
      participants: pool.participants,
      winner
    });

    winner
  }

  #[test]
  fun test_mock_pool(): Pool {
    let mut ctx = tx_context::dummy();
    let winner = option::none();

    // mock participants
    let mut participants = vector::empty<address>();
    participants.push_back(@0x1231);
    participants.push_back(@0x1232);

    let pool = Pool {
      id: object::new(&mut ctx),
      participants,
      winner
    };

    return pool
  }

  // #[test]
  // fun test_join() {

  //   // with multiple
  //   {

  //     let mut i = shared::MAX_TOKEN();

  //     while (i > 0) {
  //       let mut ctx = tx_context::dummy();
  //       let mut collection = nft::test_mock_collection();
  //       let mut ticket = ticket::test_mock_ticket(shared::PRICE_SWAP_TICKET_TO_GET_NFT());

  //       // mock pool
  //       let mut pool = test_mock_pool();

  //       join(&mut pool, &mut collection, &mut ticket, &mut random::new_generator_for_testing(), &mut ctx);

  //       // cleanup memory
  //       transfer::public_transfer(collection, ctx.sender());
  //       transfer::public_transfer(ticket, ctx.sender());
  //       transfer::public_transfer(pool, ctx.sender());

  //       i = i - 1;
  //     };
  //   };

  //   // with single
  //   {
  //     let mut ctx = tx_context::dummy();
  //     let mut collection = nft::test_mock_collection();
  //     let mut ticket = ticket::test_mock_ticket(shared::PRICE_SWAP_TICKET_TO_GET_NFT());

  //     // mock pool
  //     let mut pool = test_mock_pool();

  //     join(&mut pool, &mut collection, &mut ticket, &mut random::new_generator_for_testing(), &mut ctx);

  //     // cleanup memory
  //     transfer::public_transfer(collection, ctx.sender());
  //     transfer::public_transfer(ticket, ctx.sender());
  //     transfer::public_transfer(pool, ctx.sender());
  //   };
  // }
}
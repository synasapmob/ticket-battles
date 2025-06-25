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

    event::emit(PoolEvent { 
      participants: pool.participants,
      winner
    });

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
      };

      event::emit(PoolEvent { 
        participants: pool.participants,
        winner
      });
    };

    return winner
  }
}